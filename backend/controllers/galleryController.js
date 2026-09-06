const db = require("../config/db");


// ==========================================
// GET ACTIVE GALLERY - PUBLIC
// ==========================================

const getGallery = async (req, res) => {

    try {

        const [items] = await db.query(`
            SELECT
                id,
                title,
                image,
                video,
                description,
                created_at
            FROM gallery
            WHERE is_active = 1
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            items
        });

    } catch (error) {

        console.error("GET GALLERY ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load gallery."
        });

    }

};


// ==========================================
// GET ALL GALLERY - ADMIN
// ==========================================

const getAllGallery = async (req, res) => {

    try {

        const [items] = await db.query(`
            SELECT
                id,
                title,
                image,
                video,
                description,
                is_active,
                created_at
            FROM gallery
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            items
        });

    } catch (error) {

        console.error("GET ALL GALLERY ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load gallery."
        });

    }

};


const createGallery = async (req, res) => {

    try {

        const {
            title,
            description
        } = req.body;

        if (!title) {

            return res.status(400).json({
                success: false,
                message: "Title is required."
            });

        }

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Please select an image or video."
            });

        }

        const file = req.file;

        let image = null;
        let video = null;

        if (file.mimetype.startsWith("image/")) {

            image = `/gallery/${file.filename}`;

        } else if (file.mimetype.startsWith("video/")) {

            video = `/videos/${file.filename}`;

        } else {

            return res.status(400).json({
                success: false,
                message: "Only image and video files are allowed."
            });

        }

        await db.query(
            `
            INSERT INTO gallery
            (
                title,
                image,
                video,
                description,
                is_active
            )
            VALUES (?, ?, ?, ?, 1)
            `,
            [
                title.trim(),
                image,
                video,
                description?.trim() || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Gallery item added successfully."
        });

    } catch (error) {

        console.error("CREATE GALLERY ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add gallery item."
        });

    }

};


// ==========================================
// UPDATE GALLERY ITEM
// ==========================================

const updateGallery = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            title,
            description,
            is_active
        } = req.body;


        if (!title) {

            return res.status(400).json({
                success: false,
                message: "Title is required."
            });

        }


        await db.query(
            `
            UPDATE gallery
            SET
                title = ?,
                description = ?,
                is_active = ?
            WHERE id = ?
            `,
            [
                title.trim(),
                description?.trim() || null,
                is_active ?? 1,
                id
            ]
        );


        res.json({
            success: true,
            message: "Gallery item updated successfully."
        });

    } catch (error) {

        console.error("UPDATE GALLERY ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update gallery item."
        });

    }

};


// ==========================================
// DELETE GALLERY ITEM
// ==========================================

const deleteGallery = async (req, res) => {

    try {

        const { id } = req.params;


        const [result] = await db.query(
            "DELETE FROM gallery WHERE id = ?",
            [id]
        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Gallery item not found."
            });

        }


        res.json({
            success: true,
            message: "Gallery item deleted successfully."
        });

    } catch (error) {

        console.error("DELETE GALLERY ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete gallery item."
        });

    }

};


module.exports = {
    getGallery,
    getAllGallery,
    createGallery,
    updateGallery,
    deleteGallery
};