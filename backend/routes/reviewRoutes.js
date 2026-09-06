const express = require("express");

const {
    getApprovedReviews,
    createReview,
    getAllReviews,
    approveReview,
    deleteReview
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// PUBLIC
router.get("/", getApprovedReviews);

router.post("/", createReview);


// ADMIN
router.get("/admin/all", protect, getAllReviews);

router.put("/:id/approve", protect, approveReview);

router.delete("/:id", protect, deleteReview);


module.exports = router;