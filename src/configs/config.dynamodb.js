'use strict'
const process = require('process');

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3053
    },
    db: {
        endpoint: process.env.DEV_DYNAMO_ENDPOINT || 'http://localhost:8000',
        region: process.env.DEV_DYNAMO_REGION || 'us-west-2'
    }
}

const product = {
    app: {
        port: process.env.PRO_APP_PORT || 3055
    },
    db: {
        endpoint: process.env.DEV_DYNAMO_ENDPOINT || 'http://localhost:8000',
        region: process.env.DEV_DYNAMO_REGION || 'us-west-2'
    }
}

const config = {dev, product};
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env]