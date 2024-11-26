const express = require('express');
const GroceryStock = require('../models/GroceryStock');  // Import the GroceryStock model
const router = express.Router();

// GET route to list all general stock
router.get('/admingrocery/generalstock', async (req, res) => {
  try {
    // Fetch all the grocery stock from the database
    const allStocks = await GroceryStock.find();

    if (!allStocks || allStocks.length === 0) {
      // If no stock found
      return res.status(404).json({
        message: 'No stock found',
      });
    }

    // Return success response with all stock data
    res.status(200).json({
      message: 'General stock fetched successfully!',
      data: allStocks,
    });
  } catch (error) {
    // Error handling
    console.error('Error fetching general stock:', error);
    res.status(500).json({
      message: 'Failed to fetch general stock',
      error: error.message,
    });
  }
});

module.exports = router;
