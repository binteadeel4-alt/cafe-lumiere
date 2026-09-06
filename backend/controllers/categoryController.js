const db = require("../config/db");

const getCategories = async (req, res) => {
    try {
        const [categories] = await db.query(
            "SELECT * FROM categories order by name asc"
        );

        res.json({
            success: true,
            categories
        });
    } catch (error) {
        console.error("GET CATEGORIES ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories."
        });
    }
};

module.exports = {
    getCategories
};