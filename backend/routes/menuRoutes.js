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

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// Public

router.get("/", getMenuItems);

router.get("/gallery", getGalleryItems);


// Protected Admin Routes

router.get("/admin/all", protect, getAllMenuItems);


// ADD MENU ITEM

router.post(
    "/",
    protect,
    (req, res, next) => {

        upload.single("image")(req, res, (error) => {

            if (error) {

                console.error("MENU IMAGE UPLOAD ERROR:", error);

                return res.status(400).json({
                    success: false,
                    message: error.message || "Image upload failed."
                });
            }

            next();
        });

    },
    createMenuItem
);


// UPDATE MENU ITEM

router.put(
    "/:id",
    protect,
    (req, res, next) => {

        upload.single("image")(req, res, (error) => {

            if (error) {

                console.error("MENU IMAGE UPLOAD ERROR:", error);

                return res.status(400).json({
                    success: false,
                    message: error.message || "Image upload failed."
                });
            }

            next();
        });

    },
    updateMenuItem
);


// DELETE MENU ITEM

router.delete(
    "/:id",
    protect,
    deleteMenuItem
);


module.exports = router;

