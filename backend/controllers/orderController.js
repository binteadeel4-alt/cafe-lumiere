const db = require("../config/db");

const createOrder = async (req, res) => {
    const connection = await db.getConnection();
    let transactionStarted = false;

    try {
        const {
            customer_name,
            customer_phone,
            customer_email,
            items
        } = req.body;

        // -----------------------------
        // Validate customer information
        // -----------------------------

        if (
            typeof customer_name !== "string" ||
            !customer_name.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Customer name is required."
            });
        }

        if (
            typeof customer_phone !== "string" ||
            !customer_phone.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Customer phone is required."
            });
        }

        if (
            customer_email !== undefined &&
            customer_email !== null &&
            customer_email !== ""
        ) {
            if (
                typeof customer_email !== "string" ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email.trim())
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid email address."
                });
            }
        }

        // -----------------------------
        // Validate order items
        // -----------------------------

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one order item is required."
            });
        }

        // Prevent duplicate menu items
        const menuItemIds = items.map((item) => item.menu_item_id);

        const uniqueMenuItemIds = new Set(menuItemIds);

        if (uniqueMenuItemIds.size !== menuItemIds.length) {
            return res.status(400).json({
                success: false,
                message: "Duplicate menu items are not allowed in an order."
            });
        }

        await connection.beginTransaction();
        transactionStarted = true;

        // We calculate money in thousandths because menu prices
        // have 3 decimal places (e.g. 2.500 KWD).
        let totalInThousandths = 0;

        const orderItems = [];

        for (const item of items) {

            // Validate menu item ID
            const menuItemId = Number(item.menu_item_id);

            if (
                !Number.isInteger(menuItemId) ||
                menuItemId < 1
            ) {
                throw new Error("Invalid menu item.");
            }

            // Validate quantity
            const quantity = Number(item.quantity);

            if (
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                quantity > 100
            ) {
                throw new Error(
                    "Each item quantity must be between 1 and 100."
                );
            }

            // Always get the price from the database.
            // Never trust a price sent by the frontend.
            const [menuRows] = await connection.query(
                `SELECT
                    id,
                    name,
                    price,
                    is_available
                 FROM menu_items
                 WHERE id = ?`,
                [menuItemId]
            );

            if (menuRows.length === 0) {
                throw new Error(
                    `Menu item ${menuItemId} does not exist.`
                );
            }

            const menuItem = menuRows[0];

            // Convert database price to thousandths.
            const priceInThousandths = Math.round(
                Number(menuItem.price) * 1000
            );

            const itemTotalInThousandths =
                priceInThousandths * quantity;

            if (!Number(menuItem.is_available)) {
                throw new Error(
                    `${menuItem.name} is currently unavailable.`
                );
            }

            totalInThousandths += itemTotalInThousandths;

            orderItems.push({
                menu_item_id: menuItem.id,
                quantity,
                price: Number(menuItem.price).toFixed(3)
            });
        }

        const totalAmount =
            (totalInThousandths / 1000).toFixed(3);

        // -----------------------------
        // Create order
        // -----------------------------

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
                customer_name.trim(),
                customer_phone.trim(),
                customer_email
                    ? customer_email.trim()
                    : null,
                totalAmount
            ]
        );

        const orderId = orderResult.insertId;

        // -----------------------------
        // Create order items
        // -----------------------------

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
        transactionStarted = false;

        res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            order: {
                id: orderId,
                total_amount: totalAmount,
                status: "pending"
            }
        });

    } catch (error) {

        if (transactionStarted) {
            await connection.rollback();
        }

        console.error("CREATE ORDER ERROR:", error);

        const validationErrors = [
            "does not exist",
            "currently unavailable",
            "Invalid menu item",
            "quantity must be"
        ];

        const isValidationError = validationErrors.some((message) =>
            error.message.includes(message)
        );

        res.status(isValidationError ? 400 : 500).json({
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
