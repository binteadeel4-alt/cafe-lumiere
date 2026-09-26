const db = require("../config/db");


// GET ALL AVAILABLE MENU ITEMS
const getMenuItems = async (req, res) => {
    try {
        const [items] = await db.query(`
SELECT
menu_items.id,
    menu_items.name,
    menu_items.description,
    menu_items.price,
    menu_items.image,
    menu_items.is_available,
    menu_items.is_featured,
    categories.name AS category
            FROM menu_items
            INNER JOIN categories
                ON menu_items.category_id = categories.id
            WHERE menu_items.is_available = TRUE
            ORDER BY categories.name, menu_items.name
    `);

        res.json({
            success: true,
            items
        });

    } catch (error) {
        console.error("GET MENU ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch menu items."
        });
    }
};


// GET ALL MENU ITEMS FOR ADMIN
const getAllMenuItems = async (req, res) => {
    try {
        const [items] = await db.query(`
SELECT
menu_items.id,
    menu_items.name,
    menu_items.description,
    menu_items.price,
    menu_items.image,
    menu_items.is_available,
    menu_items.is_featured,
    menu_items.category_id,
    categories.name AS category
            FROM menu_items
            INNER JOIN categories
                ON menu_items.category_id = categories.id
            ORDER BY menu_items.id DESC
    `);

        res.json({
            success: true,
            items
        });

    } catch (error) {
        console.error("GET ALL MENU ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch menu items."
        });
    }
};


// ADD MENU ITEM
const createMenuItem = async (req, res) => {
    try {
        const {
            category_id,
            name,
            description,
            price,
            is_featured
        } = req.body;

        if (!category_id || !name || !price) {
            return res.status(400).json({
                success: false,
                message: "Category, name and price are required."
            });
        }

        const image = req.file
            ? `/images/${req.file.filename}`
            : null;

        const featuredValue =
            Number(is_featured) === 1 ? 1 : 0;

        const [result] = await db.query(
            `INSERT INTO menu_items
    (
        category_id,
        name,
        description,
        price,
        image,
        is_featured
    )
VALUES(?, ?, ?, ?, ?, ?)`,
            [
                category_id,
                name,
                description || null,
                price,
                image,
                featuredValue
            ]
        );

        res.status(201).json({
            success: true,
            message: "Menu item created successfully.",
            itemId: result.insertId
        });

    } catch (error) {
        console.error("CREATE MENU ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create menu item."
        });
    }
};


// UPDATE MENU ITEM
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            category_id,
            name,
            description,
            price,
            is_available,
            is_featured
        } = req.body;

        if (!category_id || !name || !price) {
            return res.status(400).json({
                success: false,
                message: "Category, name and price are required."
            });
        }

        const availableValue =
            Number(is_available) === 1 ? 1 : 0;

        const featuredValue =
            Number(is_featured) === 1 ? 1 : 0;

        let query;
        let values;

        if (req.file) {

            const image = `/images/${req.file.filename}`;

            query = `
                UPDATE menu_items
SET
category_id = ?,
    name = ?,
    description = ?,
    price = ?,
    image = ?,
    is_available = ?,
    is_featured = ?
        WHERE id = ?
            `;

            values = [
                category_id,
                name,
                description || null,
                price,
                image,
                availableValue,
                featuredValue,
                id
            ];

        } else {

            query = `
                UPDATE menu_items
SET
category_id = ?,
    name = ?,
    description = ?,
    price = ?,
    is_available = ?,
    is_featured = ?
        WHERE id = ?
            `;

            values = [
                category_id,
                name,
                description || null,
                price,
                availableValue,
                featuredValue,
                id
            ];
        }

        await db.query(query, values);

        res.json({
            success: true,
            message: "Menu item updated successfully."
        });

    } catch (error) {
        console.error("UPDATE MENU ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update menu item."
        });
    }
};


// DELETE MENU ITEM
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            "DELETE FROM menu_items WHERE id = ?",
            [id]
        );

        res.json({
            success: true,
            message: "Menu item deleted successfully."
        });

    } catch (error) {
        console.error("DELETE MENU ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete menu item."
        });
    }
};


// GET GALLERY ITEMS
const getGalleryItems = async (req, res) => {
    try {
        const [items] = await db.query(`
            SELECT
menu_items.id,
    menu_items.name,
    menu_items.description,
    menu_items.price,
    menu_items.image,
    categories.name AS category
            FROM menu_items
            INNER JOIN categories
                ON menu_items.category_id = categories.id
            WHERE menu_items.is_available = TRUE
              AND menu_items.image IS NOT NULL
              AND menu_items.image != ''
            ORDER BY menu_items.created_at DESC
    `);

        res.json({
            success: true,
            items
        });

    } catch (error) {
        console.error("GET GALLERY ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch gallery items."
        });
    }
};


module.exports = {
    getMenuItems,
    getAllMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getGalleryItems
};

