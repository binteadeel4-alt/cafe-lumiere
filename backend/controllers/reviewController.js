const db = require("../config/db");


// GET APPROVED REVIEWS - PUBLIC
const getApprovedReviews = async (req, res) => {
    try {
        const [reviews] = await db.query(`
            SELECT
                id,
                customer_name,
                rating,
                comment,
                created_at
            FROM reviews
            WHERE is_approved = 1
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            reviews
        });

    } catch (error) {
        console.error("GET REVIEWS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load reviews."
        });
    }
};


// CREATE REVIEW - PUBLIC
const createReview = async (req, res) => {
    try {
        const {
            customer_name,
            rating,
            comment
        } = req.body;

        if (!customer_name || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Name, rating and comment are required."
            });
        }

        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5."
            });
        }

        await db.query(
            `
            INSERT INTO reviews
            (
                customer_name,
                rating,
                comment,
                is_approved
            )
            VALUES (?, ?, ?, 0)
            `,
            [
                customer_name.trim(),
                numericRating,
                comment.trim()
            ]
        );

        res.status(201).json({
            success: true,
            message: "Thank you! Your review has been submitted and is awaiting approval."
        });

    } catch (error) {
        console.error("CREATE REVIEW ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to submit review."
        });
    }
};


// GET ALL REVIEWS - ADMIN
const getAllReviews = async (req, res) => {
    try {
        const [reviews] = await db.query(`
            SELECT
                id,
                customer_name,
                rating,
                comment,
                is_approved,
                created_at
            FROM reviews
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            reviews
        });

    } catch (error) {
        console.error("GET ALL REVIEWS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load reviews."
        });
    }
};


// APPROVE REVIEW - ADMIN
const approveReview = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            `
            UPDATE reviews
            SET is_approved = 1
            WHERE id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Review not found."
            });
        }

        res.json({
            success: true,
            message: "Review approved successfully."
        });

    } catch (error) {
        console.error("APPROVE REVIEW ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to approve review."
        });
    }
};


// DELETE REVIEW - ADMIN
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM reviews WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Review not found."
            });
        }

        res.json({
            success: true,
            message: "Review deleted successfully."
        });

    } catch (error) {
        console.error("DELETE REVIEW ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete review."
        });
    }
};


module.exports = {
    getApprovedReviews,
    createReview,
    getAllReviews,
    approveReview,
    deleteReview
};