const express = require("express");

const {
    getMenuItems,
    getAllMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getGalleryItems
} = require("../controllers/menuController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Public
router.get("/", getMenuItems);

router.get("/gallery", getGalleryItems);


// Protected Admin Routes
router.get("/admin/all", protect, getAllMenuItems);

router.post("/", protect, createMenuItem);

router.put("/:id", protect, updateMenuItem);

router.delete("/:id", protect, deleteMenuItem);

module.exports = router;