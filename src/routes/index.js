'use strict'

const express = require('express');
const { apiKey, checkPermission } = require('../utils/checkApiKey.utils');
const router = express.Router();
//checkApiKey
router.use(apiKey);
//checkPermissionApiKey
router.use(checkPermission('00'));
//addRoute
router.use('/v1/api/', require('./auth'));

module.exports = router;