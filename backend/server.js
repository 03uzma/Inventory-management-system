const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
// Test database connection
pool.connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

app.get("/", (req, res) => {
  res.send("Inventory Management API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});