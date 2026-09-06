const db = require("../config/db");

const createOrder = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const {
            customer_name,
            customer_phone,
            customer_email,
            items
        } = req.body;

        if (!customer_name || !customer_phone || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Customer information and order items are required."
            });
        }

        await connection.beginTransaction();

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {

            const [menuRows] = await connection.query(
                `SELECT id, name, price, is_available
                 FROM menu_items
                 WHERE id = ?`,
                [item.menu_item_id]
            );

            if (menuRows.length === 0) {
                throw new Error(
                    `Menu item ${item.menu_item_id} does not exist.`
                );
            }

            const menuItem = menuRows[0];

            if (!menuItem.is_available) {
                throw new Error(
                    `${menuItem.name} is currently unavailable.`
                );
            }

            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity < 1) {
                throw new Error(
                    "Invalid item quantity."
                );
            }

            const itemTotal =
                Number(menuItem.price) * quantity;

            totalAmount += itemTotal;

            orderItems.push({
                menu_item_id: menuItem.id,
                quantity,
                price: menuItem.price
            });
        }

        const [orderResult] = await connection.query(
            `INSERT INTO orders
            (
                customer_name,
                customer_phone,
                customer_email,
                total_amount
            )
            VALUES (?, ?, ?, ?)`,
            [
                customer_name,
                customer_phone,
                customer_email || null,
                totalAmount.toFixed(3)
            ]
        );

        const orderId = orderResult.insertId;

        for (const item of orderItems) {
            await connection.query(
                `INSERT INTO order_items
                (
                    order_id,
                    menu_item_id,
                    quantity,
                    price
                )
                VALUES (?, ?, ?, ?)`,
                [
                    orderId,
                    item.menu_item_id,
                    item.quantity,
                    item.price
                ]
            );
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            order: {
                id: orderId,
                total_amount: totalAmount.toFixed(3),
                status: "pending"
            }
        });

    } catch (error) {

        await connection.rollback();

        console.error("CREATE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Failed to place order."
        });

    } finally {
        connection.release();
    }
};
const getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT
                o.id,
                o.customer_name,
                o.customer_phone,
                o.customer_email,
                o.total_amount,
                o.status,
                o.created_at,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'menu_item_id', oi.menu_item_id,
                        'name', mi.name,
                        'quantity', oi.quantity,
                        'price', oi.price
                    )
                ) AS items
            FROM orders o
            JOIN order_items oi
                ON o.id = oi.order_id
            JOIN menu_items mi
                ON oi.menu_item_id = mi.id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `);

        const formattedOrders = orders.map((order) => ({
            ...order,
            items:
                typeof order.items === "string"
                    ? JSON.parse(order.items)
                    : order.items
        }));

        res.json({
            success: true,
            orders: formattedOrders
        });

    } catch (error) {
        console.error("GET ORDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load orders."
        });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "confirmed",
            "preparing",
            "ready",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status."
            });
        }

        const [result] = await db.query(
            "UPDATE orders SET status = ? WHERE id = ?",
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        res.json({
            success: true,
            message: "Order status updated successfully."
        });

    } catch (error) {
        console.error("UPDATE ORDER STATUS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update order status."
        });
    }
};


module.exports = {
    createOrder,
    getAllOrders,
    updateOrderStatus
};