const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  updateStock,
} = require("../controllers/productController");

router.post("/", addProduct);
router.get("/", getProducts);
router.put("/:id", updateStock);

module.exports = router;