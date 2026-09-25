const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const menuRoutes = require("./routes/menuRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderRoutes = require("./routes/orderRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const galleryRoutes = require("./routes/galleryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Static files
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/videos", express.static(path.join(__dirname, "videos")));
app.use("/gallery", express.static(path.join(__dirname, "gallery")));

// API routes
app.use("/api/menu", menuRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/gallery", galleryRoutes);

// API health check
app.get("/", (req, res) => {
    res.json({
        message: "Cafe Website API is running!"
    });
});

// Database test
app.get("/api/test-db", async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const [result] = await connection.query("SELECT 1");

        res.json({
            success: true,
            message: "MySQL connected successfully!",
            result
        });

    } catch (error) {
        console.error("MYSQL ERROR:");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Errno:", error.errno);
        console.error("Stack:", error.stack);

        if (error.errors) {
            console.error("Individual errors:", error.errors);
        }

        res.status(500).json({
            success: false,
            message: "Database connection failed.",
            error: error.message,
            code: error.code
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
});

