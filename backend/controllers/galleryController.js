const db = require("../config/db");
const path = require("path");
const fs = require("fs");


// ==========================================
// DELETE OLD MEDIA FILE
// ==========================================

const deleteMediaFile = (mediaPath) => {

    if (!mediaPath) {
        return;
    }

    let folder;

    if (mediaPath.startsWith("/gallery/")) {
        folder = path.join(__dirname, "../gallery");
    } else if (mediaPath.startsWith("/videos/")) {
        folder = path.join(__dirname, "../videos");
    } else {
        return;
    }

    const filename = path.basename(mediaPath);
    const filePath = path.join(folder, filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};


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


// ==========================================
// CREATE GALLERY ITEM
// ==========================================

const createGallery = async (req, res) => {

    try {

        const {
            title,
            description
        } = req.body;

        if (!title || !title.trim()) {

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

            deleteMediaFile(
                file.mimetype.startsWith("video/")
                    ? `/videos/${file.filename}`
                    : `/gallery/${file.filename}`
            );

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
VALUES(?, ?, ?, ?, 1)
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

        if (req.file) {

            const uploadedPath =
                req.file.mimetype.startsWith("video/")
                    ? `/videos/${req.file.filename}`
                    : `/gallery/${req.file.filename}`;

            deleteMediaFile(uploadedPath);
        }

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

        if (!title || !title.trim()) {

            if (req.file) {

                const uploadedPath =
                    req.file.mimetype.startsWith("video/")
                        ? `/videos/${req.file.filename}`
                        : `/gallery/${req.file.filename}`;

                deleteMediaFile(uploadedPath);
            }

            return res.status(400).json({
                success: false,
                message: "Title is required."
            });

        }

        const [existingRows] = await db.query(
            `
SELECT
id,
    image,
    video,
    is_active
            FROM gallery
            WHERE id = ?
    `,
            [id]
        );

        if (existingRows.length === 0) {

            if (req.file) {

                const uploadedPath =
                    req.file.mimetype.startsWith("video/")
                        ? `/videos/${req.file.filename}`
                        : `/gallery/${req.file.filename}`;

                deleteMediaFile(uploadedPath);
            }

            return res.status(404).json({
                success: false,
                message: "Gallery item not found."
            });

        }

        const existingItem = existingRows[0];

        let image = existingItem.image;
        let video = existingItem.video;

        // ------------------------------------------
        // MEDIA REPLACEMENT
        // ------------------------------------------

        if (req.file) {

            if (req.file.mimetype.startsWith("image/")) {

                image = `/gallery/${req.file.filename}`;
                video = null;

            } else if (req.file.mimetype.startsWith("video/")) {

                image = null;
                video = `/videos/${req.file.filename}`;

            } else {

                const uploadedPath =
                    req.file.mimetype.startsWith("video/")
                        ? `/videos/${req.file.filename}`
                        : `/gallery/${req.file.filename}`;

                deleteMediaFile(uploadedPath);

                return res.status(400).json({
                    success: false,
                    message: "Only image and video files are allowed."
                });

            }

        }

        await db.query(
            `
            UPDATE gallery
SET
title = ?,
    image = ?,
    video = ?,
    description = ?,
    is_active = ?
        WHERE id = ?
            `,
            [
                title.trim(),
                image,
                video,
                description?.trim() || null,
                is_active !== undefined
                    ? Number(is_active)
                    : Number(existingItem.is_active),
                id
            ]
        );

        // Delete old media only after successful database update.
        if (req.file) {

            if (
                existingItem.image &&
                existingItem.image !== image
            ) {
                deleteMediaFile(existingItem.image);
            }

            if (
                existingItem.video &&
                existingItem.video !== video
            ) {
                deleteMediaFile(existingItem.video);
            }
        }

        res.json({
            success: true,
            message: "Gallery item updated successfully."
        });

    } catch (error) {

        console.error("UPDATE GALLERY ERROR:", error);

        if (req.file) {

            const uploadedPath =
                req.file.mimetype.startsWith("video/")
                    ? `/videos/${req.file.filename}`
                    : `/gallery/${req.file.filename}`;

            deleteMediaFile(uploadedPath);
        }

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

        const [rows] = await db.query(
            `
SELECT
image,
    video
            FROM gallery
            WHERE id = ?
    `,
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Gallery item not found."
            });

        }

        const item = rows[0];

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

        if (item.image) {
            deleteMediaFile(item.image);
        }

        if (item.video) {
            deleteMediaFile(item.video);
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

