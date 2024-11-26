const GroceryStock = require("../models/GroceryStock");

// Add new grocery stock
exports.addStock = async (req, res) => {
    const { name, unit, availability, price } = req.body;

    if (!name || !unit || !availability || !price) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const newStock = new GroceryStock({ name, unit, availability, price });
        const savedStock = await newStock.save();

        res.status(201).json({ message: "Stock added successfully", stock: savedStock });
    } catch (error) {
        console.error("Error adding stock:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Other CRUD operations (getAllStocks, getStockById, updateStock, deleteStock) can be added similarly
