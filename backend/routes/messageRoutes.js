const express = require("express");

const {
    createMessage,
    getMessages,
    markMessageAsRead,
    deleteMessage
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// CUSTOMER
router.post("/", createMessage);

// ADMIN
router.get("/", protect, getMessages);

router.put("/:id/read", protect, markMessageAsRead);

router.delete("/:id", protect, deleteMessage);

module.exports = router;