const mongoose = require('mongoose');

const GroceryStockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    unit: {
        type: String,
        required: true,
        trim: true,
    },
    availability: {
        type: Number,
        required: true,
        min: 0,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true,
});

const GroceryStock = mongoose.model("GroceryStock", GroceryStockSchema);
module.exports = GroceryStock;
