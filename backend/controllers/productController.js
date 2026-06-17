// const pool = require("../config/db");

// // =======================
// // Add Product
// // =======================
// exports.addProduct = async (req, res) => {
//   try {
//     const { name, category, price, quantity } = req.body;

//     // Validation
//     if (!name || !category || price == null || quantity == null) {
//       return res.status(400).json({
//         message: "All fields are required",
//       });
//     }

//     // Check if product already exists
//     const existingProduct = await pool.query(
//       "SELECT * FROM products WHERE LOWER(name) = LOWER($1)",
//       [name]
//     );

//     // Product exists -> Increase stock
//     if (existingProduct.rows.length > 0) {
//       const updatedProduct = await pool.query(
//         `UPDATE products
//          SET
//            quantity = quantity + $1,
//            price = $2,
//            category = $3
//          WHERE LOWER(name) = LOWER($4)
//          RETURNING *`,
//         [quantity, price, category, name]
//       );

//       return res.status(200).json({
//         message: "Product already exists. Stock updated successfully.",
//         product: updatedProduct.rows[0],
//       });
//     }

//     // Insert new product
//     const result = await pool.query(
//       `INSERT INTO products (name, category, price, quantity)
//        VALUES ($1, $2, $3, $4)
//        RETURNING *`,
//       [name, category, price, quantity]
//     );

//     res.status(201).json({
//       message: "Product added successfully.",
//       product: result.rows[0],
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Server Error",
//     });
//   }
// };

// // =======================
// // Get All Products
// // =======================
// exports.getProducts = async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM products ORDER BY id ASC"
//     );

//     res.status(200).json(result.rows);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Server Error",
//     });
//   }
// };

// // =======================
// // Update Stock
// // =======================
// exports.updateStock = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { quantity } = req.body;

//     if (quantity == null) {
//       return res.status(400).json({
//         message: "Quantity is required",
//       });
//     }

//     // Find product
//     const product = await pool.query(
//       "SELECT * FROM products WHERE id = $1",
//       [id]
//     );

//     if (product.rows.length === 0) {
//       return res.status(404).json({
//         message: "Product not found",
//       });
//     }

//     const currentQuantity = product.rows[0].quantity;
//     const newQuantity = currentQuantity + Number(quantity);

//     // Prevent negative stock
//     if (newQuantity < 0) {
//       return res.status(400).json({
//         message: "Insufficient stock. Cannot reduce below zero.",
//       });
//     }

//     const updated = await pool.query(
//       `UPDATE products
//        SET quantity = $1
//        WHERE id = $2
//        RETURNING *`,
//       [newQuantity, id]
//     );

//     res.status(200).json({
//       message: "Stock updated successfully.",
//       product: updated.rows[0],
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Server Error",
//     });
//   }
// };

// // =======================
// // Get Low Stock Products
// // =======================
// exports.getLowStockProducts = async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM products WHERE quantity <= 5 ORDER BY quantity ASC"
//     );

//     res.status(200).json(result.rows);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Server Error",
//     });
//   }
// };


const pool = require("../config/db");

// =======================
// Add Product
// =======================
exports.addProduct = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    if (!name || !category || price == null || quantity == null) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingProduct = await pool.query(
      "SELECT * FROM products WHERE LOWER(name) = LOWER($1)",
      [name]
    );

    if (existingProduct.rows.length > 0) {
      const updatedProduct = await pool.query(
        `UPDATE products
         SET quantity = quantity + $1,
             price = $2,
             category = $3
         WHERE LOWER(name) = LOWER($4)
         RETURNING *`,
        [quantity, price, category, name]
      );

      return res.status(200).json({
        message: "Product already exists. Stock updated successfully.",
        product: updatedProduct.rows[0],
      });
    }

    const result = await pool.query(
      `INSERT INTO products(name, category, price, quantity)
       VALUES($1,$2,$3,$4)
       RETURNING *`,
      [name, category, price, quantity]
    );

    res.status(201).json({
      message: "Product added successfully.",
      product: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =======================
// Get All Products
// =======================
exports.getProducts = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM products ORDER BY id ASC"
    );

    res.status(200).json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =======================
// Update Stock
// =======================
exports.updateStock = async (req, res) => {

  try {

    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity == null) {
      return res.status(400).json({
        message: "Quantity is required",
      });
    }

    const product = await pool.query(
      "SELECT * FROM products WHERE id=$1",
      [id]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (Number(quantity) < 0) {
      return res.status(400).json({
        message: "Quantity cannot be negative",
      });
    }

    const updated = await pool.query(
      `UPDATE products
       SET quantity=$1
       WHERE id=$2
       RETURNING *`,
      [quantity, id]
    );

    res.status(200).json({
      message: "Stock updated successfully.",
      product: updated.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =======================
// Get Low Stock Products
// =======================
exports.getLowStockProducts = async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM products WHERE quantity <= 3 ORDER BY quantity ASC"
    );

    res.status(200).json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};