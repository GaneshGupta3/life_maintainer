const express = require('express');
const router = express.Router();
const { getProgress, updateDayStatus } = require('../controllers/progressController');

router.route('/:year/:month').get(getProgress);
router.route('/:year/:month/:day').put(updateDayStatus);

module.exports = router;
