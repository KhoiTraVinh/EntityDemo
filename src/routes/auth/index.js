'use strict'
const AuthController = require('../../controllers/auth.controller');
const { asyncHandler } = require('../../utils/checkApiKey.utils')
const express = require('express');
const router = express.Router();

router.post('/signup', asyncHandler(AuthController.signUp));

module.exports = router;