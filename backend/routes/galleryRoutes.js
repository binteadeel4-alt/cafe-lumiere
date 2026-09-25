const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
    getGallery,
    getAllGallery,
    createGallery,
    updateGallery,
    deleteGallery
} = require("../controllers/galleryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// UPLOAD STORAGE
// ==========================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        const isVideo =
            file.mimetype.startsWith("video/");

        const folder = isVideo
            ? path.join(__dirname, "../videos")
            : path.join(__dirname, "../gallery");

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, {
                recursive: true
            });
        }

        cb(null, folder);
    },

    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname);

        const filename =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

        cb(null, filename);
    }

});


// ==========================================
// FILE FILTER
// ==========================================

const fileFilter = (req, file, cb) => {

    const allowedImages = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    const allowedVideos = [
        "video/mp4",
        "video/webm",
        "video/quicktime"
    ];

    if (
        allowedImages.includes(file.mimetype) ||
        allowedVideos.includes(file.mimetype)
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, PNG, WEBP, MP4, WEBM and MOV files are allowed."
            ),
            false
        );
    }
};


const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 100 * 1024 * 1024
    }

});


// ==========================================
// PUBLIC
// ==========================================

router.get("/", getGallery);


// ==========================================
// ADMIN
// ==========================================

router.get(
    "/admin/all",
    protect,
    getAllGallery
);


router.post(
    "/",
    protect,
    upload.single("file"),
    createGallery
);


router.put(
    "/:id",
    protect,
    upload.single("file"),
    updateGallery
);


router.delete(
    "/:id",
    protect,
    deleteGallery
);


module.exports = router;