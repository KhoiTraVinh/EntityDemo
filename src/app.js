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
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
// init db
require('./dbs/init.mongodb');
checkOverLoad();
//int routes
app.use('/', require('./routes'));

// handling error

module.exports = app;