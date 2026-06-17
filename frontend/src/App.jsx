// import { useEffect, useState } from "react";
// import API from "./api/axios";
// import "./App.css";

// function App() {
//   const [products, setProducts] = useState([]);

//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     price: "",
//     quantity: "",
//   });

//   const fetchProducts = async () => {
//     try {
//       const res = await API.get("/products");
//       setProducts(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await API.post("/products", formData);

//       setFormData({
//         name: "",
//         category: "",
//         price: "",
//         quantity: "",
//       });

//       fetchProducts();
//     } catch (err) {
//       alert(err.response?.data?.message || "Something went wrong");
//     }
//   };

//   const updateStock = async (id, quantity) => {
//     try {
//       await API.put(`/products/${id}`, {
//         quantity,
//       });

//       fetchProducts();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const totalProducts = products.length;

//   const totalQuantity = products.reduce(
//     (sum, p) => sum + Number(p.quantity),
//     0
//   );

//   const totalValue = products.reduce(
//     (sum, p) => sum + p.price * p.quantity,
//     0
//   );

//   return (
//     <div className="container">

//       <h1>Inventory Management System</h1>

//       {/* Dashboard */}

//       <div className="dashboard">

//         <div className="card">
//           <h3>Total Products</h3>
//           <p>{totalProducts}</p>
//         </div>

//         <div className="card">
//           <h3>Total Quantity</h3>
//           <p>{totalQuantity}</p>
//         </div>

//         <div className="card">
//           <h3>Total Value</h3>
//           <p>₹ {totalValue}</p>
//         </div>

//       </div>

//       {/* Add Product */}

//       <div className="form-container">

//         <h2>Add Product</h2>

//         <form onSubmit={handleSubmit}>

//           <input
//             type="text"
//             name="name"
//             placeholder="Product Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="text"
//             name="category"
//             placeholder="Category"
//             value={formData.category}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="number"
//             name="price"
//             placeholder="Price"
//             value={formData.price}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="number"
//             name="quantity"
//             placeholder="Quantity"
//             value={formData.quantity}
//             onChange={handleChange}
//             required
//           />

//           <button type="submit">
//             Add Product
//           </button>

//         </form>

//       </div>

//       {/* Product Table */}

//       <div className="table-container">

//         <h2>Inventory</h2>

//         <table>

//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Category</th>
//               <th>Price</th>
//               <th>Quantity</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>

//             {products.map((product) => (

//               <tr key={product.id}>

//                 <td>{product.id}</td>

//                 <td>{product.name}</td>

//                 <td>{product.category}</td>

//                 <td>₹ {product.price}</td>

//                 <td>{product.quantity}</td>

//                 <td>
//                   {product.quantity <= 3 ? (
//                     <span className="low-stock">
//                       Low Stock
//                     </span>
//                   ) : (
//                     <span className="in-stock">
//                       In Stock
//                     </span>
//                   )}
//                 </td>

//                 <td>

//                   <button
//                     className="plus"
//                     onClick={() =>
//                       updateStock(
//                         product.id,
//                         product.quantity + 1
//                       )
//                     }
//                   >
//                     +
//                   </button>

//                   <button
//                     className="minus"
//                     onClick={() =>
//                       updateStock(
//                         product.id,
//                         Math.max(product.quantity - 1, 0)
//                       )
//                     }
//                   >
//                     -
//                   </button>

//                 </td>

//               </tr>

//             ))}

//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// }

// export default App;

import { useEffect, useState } from "react";
import API from "./api/axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [stockInputs, setStockInputs] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);

      const inputs = {};
      res.data.forEach((product) => {
        inputs[product.id] = 1;
      });

      setStockInputs(inputs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/products", formData);
      alert("Product Added Successfully!");

      setFormData({
        name: "",
        category: "",
        price: "",
        quantity: "",
      });

      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleStockInput = (id, value) => {
    setStockInputs({
      ...stockInputs,
      [id]: value,
    });
  };

  const updateStock = async (product, operation) => {
    const change = Number(stockInputs[product.id]);

    if (change <= 0 || isNaN(change)) {
      alert("Enter a valid quantity.");
      return;
    }

    let newQuantity;

    if (operation === "add") {
      newQuantity = Number(product.quantity) + change;
    } else {
      if (change > product.quantity) {
        alert("Cannot remove more stock than available.");
        return;
      }
      newQuantity = Number(product.quantity) - change;
    }

    try {
      await API.put(`/products/${product.id}`, {
        quantity: newQuantity,
      });

      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to update stock.");
    }
  };

  const totalProducts = products.length;

  const totalQuantity = products.reduce(
    (sum, p) => sum + Number(p.quantity),
    0
  );

  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price) * Number(p.quantity),
    0
  );

  return (
    <div className="container">
      <h1>Inventory Management System</h1>

      <div className="dashboard">
        <div className="card">
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>

        <div className="card">
          <h3>Total Quantity</h3>
          <p>{totalQuantity}</p>
        </div>

        <div className="card">
          <h3>Total Value</h3>
          <p>₹ {totalValue}</p>
        </div>
      </div>

      <div className="form-container">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <button type="submit">Add Product</button>
        </form>
      </div>

      <div className="table-container">
        <h2>Inventory</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₹ {product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  {product.quantity <= 3 ? (
                    <span className="low-stock">Low Stock</span>
                  ) : (
                    <span className="in-stock">In Stock</span>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={stockInputs[product.id] || ""}
                    onChange={(e) =>
                      handleStockInput(product.id, e.target.value)
                    }
                    className="stock-input"
                  />
                  <button
                    className="plus"
                    onClick={() => updateStock(product, "add")}
                  >
                    + Add
                  </button>
                  <button
                    className="minus"
                    onClick={() => updateStock(product, "remove")}
                  >
                    - Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;