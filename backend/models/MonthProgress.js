const mongoose = require('mongoose');

const monthProgressSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number, // 1-12
    required: true
  },
  days: {
    type: [String], // Array of strings: 'none', 'ticked', 'wasted'
    required: true
  }
});

// Compound index to ensure year+month is unique
monthProgressSchema.index({ year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('MonthProgress', monthProgressSchema);
