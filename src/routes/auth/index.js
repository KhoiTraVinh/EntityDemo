'use strict'
const AuthController = require('../../controllers/auth.controller');
const { asyncHandler } = require('../../utils/checkApiKey.utils')
const express = require('express');
const router = express.Router();

router.post('/login', asyncHandler(AuthController.login));
router.post('/signup', asyncHandler(AuthController.signUp));
router.post('/check/email', asyncHandler(AuthController.checkExistEmail));
router.post('/check/phone', asyncHandler(AuthController.checkExistPhone));
router.post('/register', asyncHandler(AuthController.addCustomer));
module.exports = router;