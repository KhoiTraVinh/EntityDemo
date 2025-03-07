require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const app = express();
const { checkOverLoad } = require('./helpers/check.connect');
// init router
app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
// init db
require('./dbs/init.mongodb');
checkOverLoad();
//int routes
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Welcome'
    });
});

// handling error

module.exports = app;