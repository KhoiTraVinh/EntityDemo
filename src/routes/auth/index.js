'use strict'
const AuthController = require('../../controllers/auth.controller');

const express = require('express');
const router = express.Router();

router.post('/signup', AuthController.signUp);

module.exports = router;