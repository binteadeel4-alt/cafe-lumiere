const db = require("../config/db");

const getDashboardStats = async (req, res) => {
    try {

        // MENU STATISTICS

        const [menuResult] = await db.query(
            "SELECT COUNT(*) AS total FROM menu_items"
        );

        const [availableResult] = await db.query(
            "SELECT COUNT(*) AS total FROM menu_items WHERE is_available = TRUE"
        );

        const [categoryResult] = await db.query(
            "SELECT COUNT(*) AS total FROM categories"
        );


        // ORDER STATISTICS

        const [orderResult] = await db.query(
            "SELECT COUNT(*) AS total FROM orders"
        );

        const [pendingResult] = await db.query(
            "SELECT COUNT(*) AS total FROM orders WHERE status = 'pending'"
        );

        const [preparingResult] = await db.query(
            "SELECT COUNT(*) AS total FROM orders WHERE status = 'preparing'"
        );

        const [completedResult] = await db.query(
            "SELECT COUNT(*) AS total FROM orders WHERE status = 'completed'"
        );


        // TOTAL SALES
        // Only completed orders count as sales.

        const [salesResult] = await db.query(
            `SELECT COALESCE(SUM(total_amount), 0) AS total
             FROM orders
             WHERE status = 'completed'`
        );


        // UNREAD MESSAGES

        const [unreadMessagesResult] = await db.query(
            `SELECT COUNT(*) AS total
             FROM messages
             WHERE is_read = 0`
        );


        res.json({
            success: true,

            stats: {
                totalMenuItems: menuResult[0].total,
                availableItems: availableResult[0].total,
                totalCategories: categoryResult[0].total,

                totalOrders: orderResult[0].total,
                pendingOrders: pendingResult[0].total,
                preparingOrders: preparingResult[0].total,
                completedOrders: completedResult[0].total,

                totalSales: salesResult[0].total,

                unreadMessages: unreadMessagesResult[0].total
            }
        });

    } catch (error) {

        console.error("DASHBOARD ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard statistics."
        });
    }
};


module.exports = {
    getDashboardStats
};