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
            path.extname(file.originalname).toLowerCase();

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
        fileSize: 100 * 1024 * 1024,
        files: 1
    }

});


// ==========================================
// UPLOAD ERROR HANDLER
// ==========================================

const handleUpload = (req, res, next) => {

    upload.single("file")(req, res, (error) => {

        if (error) {

            console.error(
                "GALLERY UPLOAD ERROR:",
                error
            );

            if (error instanceof multer.MulterError) {

                if (error.code === "LIMIT_FILE_SIZE") {

                    return res.status(400).json({
                        success: false,
                        message: "File size must be 100 MB or smaller."
                    });

                }

                if (error.code === "LIMIT_FILE_COUNT") {

                    return res.status(400).json({
                        success: false,
                        message: "Only one image or video can be uploaded."
                    });

                }

                return res.status(400).json({
                    success: false,
                    message: "Gallery upload failed."
                });

            }

            return res.status(400).json({
                success: false,
                message: error.message ||
                    "Invalid gallery file."
            });

        }

        next();

    });

};


// ==========================================
// PUBLIC
// ==========================================

router.get(
    "/",
    getGallery
);


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
    handleUpload,
    createGallery
);


router.put(
    "/:id",
    protect,
    handleUpload,
    updateGallery
);


router.delete(
    "/:id",
    protect,
    deleteGallery
);


module.exports = router;

