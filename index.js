const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config(); // For environment variables

// Importing Models
const UsergroceryModel = require("./models/Usergrocery");
const GroceryStock = require("./models/GroceryStock");

const app = express();
const port = process.env.PORT || 3001;

// Middleware for CORS and JSON parsing
app.use(
  cors({
    origin: ["http://localhost:3000"], // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/groceryApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// User Registration
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const existingUser = await UsergroceryModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UsergroceryModel({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    const { password: _, ...userData } = savedUser.toObject();
    res.status(201).json(userData);
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required!" });
  }

  try {
    const user = await UsergroceryModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ message: "Login successful", user: userData });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add Stock
app.post("/admingrocery/addstock", async (req, res) => {
  const { name, unit, availability, price, imageUrl } = req.body;

  if (!name || !unit || !availability || !price) {
    return res.status(400).json({
      message: "All fields are required: name, unit, availability, price.",
    });
  }

  try {
    const newStock = new GroceryStock({
      name,
      unit,
      availability,
      price,
      imageUrl,
    });
    await newStock.save();
    res.status(201).json({ message: "Stock created successfully!", data: newStock });
  } catch (error) {
    console.error("Error creating stock:", error.message);
    res.status(500).json({ message: "Failed to create stock" });
  }
});

// Get All Stock
app.get("/admingrocery/generalstock", async (req, res) => {
  try {
    const allStocks = await GroceryStock.find();
    if (!allStocks.length) {
      return res.status(404).json({ message: "No stock found" });
    }
    res.status(200).json({ message: "General stock fetched successfully!", data: allStocks });
  } catch (error) {
    console.error("Error fetching general stock:", error.message);
    res.status(500).json({ message: "Failed to fetch general stock" });
  }
});

// Edit Stock by ID
app.get("/admingrocery/editstock/:id", async (req, res) => {
  try {
    const stock = await GroceryStock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });
    res.status(200).json({ data: stock });
  } catch (err) {
    console.error("Error fetching stock:", err.message);
    res.status(500).json({ error: "Failed to fetch stock" });
  }
});

// Update Stock by ID
app.put("/admingrocery/editstock/:id", async (req, res) => {
  const { name, unit, availability, price, imageUrl } = req.body;

  try {
    const updatedStock = await GroceryStock.findByIdAndUpdate(
      req.params.id,
      { name, unit, availability, price, imageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.status(200).json({ message: "Stock updated successfully!", data: updatedStock });
  } catch (err) {
    console.error("Error updating stock:", err.message);
    res.status(500).json({ error: "Failed to update stock" });
  }
});

// Delete Stock by ID
app.delete("/admingrocery/deletestock/:id", async (req, res) => {
  try {
    const deletedStock = await GroceryStock.findByIdAndDelete(req.params.id);
    if (!deletedStock) return res.status(404).json({ message: "Stock not found" });
    res.status(200).json({ message: "Stock deleted successfully", data: deletedStock });
  } catch (err) {
    console.error("Error deleting stock:", err.message);
    res.status(500).json({ error: "Failed to delete stock" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
