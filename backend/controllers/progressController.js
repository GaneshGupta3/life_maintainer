const MonthProgress = require('../models/MonthProgress');

// @desc    Get progress for a specific year and month
// @route   GET /api/progress/:year/:month
// @access  Public
const getProgress = async (req, res) => {
  const { year, month } = req.params;
  try {
    let progress = await MonthProgress.findOne({ year: parseInt(year), month: parseInt(month) });

    if (!progress) {
      // Create empty progress if it doesn't exist
      const daysInMonth = new Date(year, month, 0).getDate();
      const days = new Array(daysInMonth).fill('none');
      progress = new MonthProgress({ year: parseInt(year), month: parseInt(month), days });
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a specific day's status
// @route   PUT /api/progress/:year/:month/:day
// @access  Public
const updateDayStatus = async (req, res) => {
  const { year, month, day } = req.params;
  const { status } = req.body; // 'none', 'ticked', 'wasted'

  try {
    const progress = await MonthProgress.findOne({ year: parseInt(year), month: parseInt(month) });

    if (!progress) {
      return res.status(404).json({ message: 'Month progress not found' });
    }

    // day is 1-indexed, array is 0-indexed
    const dayIndex = parseInt(day) - 1;
    if (dayIndex >= 0 && dayIndex < progress.days.length) {
      progress.days[dayIndex] = status;

      // We need to tell mongoose the mixed array was modified so it saves
      progress.markModified('days');
      await progress.save();

      res.json(progress);
    } else {
      res.status(400).json({ message: 'Invalid day' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProgress,
  updateDayStatus
};
