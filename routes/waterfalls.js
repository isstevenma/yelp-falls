const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Waterfall = require('../models/waterfall');
const router = express.Router();
const waterfalls = require('../controllers/waterfalls');
const { isLoggedIn, validateWaterfall, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(waterfalls.index))
    .post(isLoggedIn, upload.array('image'), validateWaterfall, catchAsync(waterfalls.createWaterfall));

router.get('/new', isLoggedIn, waterfalls.renderNewForm);

router.route('/:id')
    .get(catchAsync(waterfalls.showWaterfall))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateWaterfall, catchAsync(waterfalls.updateWaterfall))
    .delete(isLoggedIn, catchAsync(waterfalls.deleteWaterfall));



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(waterfalls.renderEditForm));

module.exports = router;