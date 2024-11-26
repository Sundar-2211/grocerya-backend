const mongoose = require('mongoose');

const groceryStockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  availability: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: false },  // Optional field
}, { versionKey: '__v' });  // This will enable versioning

const GroceryStock = mongoose.model('GroceryStock', groceryStockSchema);

module.exports = GroceryStock;
