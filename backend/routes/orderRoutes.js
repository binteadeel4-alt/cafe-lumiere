const express = require("express");

const {
    createOrder,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createOrder);

router.get("/", protect, getAllOrders);

router.put("/:id/status", protect, updateOrderStatus);

module.exports = router;