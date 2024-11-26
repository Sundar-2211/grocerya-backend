const express = require('express');
const router = express.Router();
const GroceryStock = require('../models/GroceryStock');

// POST route to add stock
router.post('/addstock', async (req, res) => {
  const { name, unit, availability, price } = req.body;
  try {
    const newStock = new GroceryStock({
      name,
      unit,
      availability,
      price,
    });
    await newStock.save();
    res.status(201).json({
      message: 'Stock created successfully!',
      data: newStock,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create stock', error: error.message });
  }
});

module.exports = router;
