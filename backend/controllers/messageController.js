const db = require("../config/db");

const createMessage = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            subject,
            message
        } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }

        const [result] = await db.query(
            `INSERT INTO messages
            (name, email, phone, subject, message)
            VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                email,
                phone || null,
                subject,
                message
            ]
        );

        res.status(201).json({
            success: true,
            message: "Message sent successfully.",
            data: {
                id: result.insertId
            }
        });

    } catch (error) {
        console.error("MESSAGE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message."
        });
    }
};


const getMessages = async (req, res) => {
    try {

        const [messages] = await db.query(
            `SELECT *
             FROM messages
             ORDER BY created_at DESC`
        );

        res.json({
            success: true,
            messages
        });

    } catch (error) {
        console.error("GET MESSAGES ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load messages."
        });
    }
};

const markMessageAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            "UPDATE messages SET is_read = 1 WHERE id = ?",
            [id]
        );

        res.json({
            success: true,
            message: "Message marked as read."
        });

    } catch (error) {
        console.error("MARK MESSAGE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to mark message as read."
        });
    }
};

const deleteMessage = async (req, res) => {
    try {

        const { id } = req.params;

        await db.query(
            "DELETE FROM messages WHERE id = ?",
            [id]
        );

        res.json({
            success: true,
            message: "Message deleted successfully."
        });

    } catch (error) {
        console.error("DELETE MESSAGE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete message."
        });
    }
};


module.exports = {
    createMessage,
    getMessages,
    markMessageAsRead,
    deleteMessage
};