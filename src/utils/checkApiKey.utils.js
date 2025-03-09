'use strict'
const { ForbiddenRequestError } = require('../core/error.response');
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
};

const { findById } = require('../services/apiKey.service');

const apiKey = async (req, res, next) => {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
        throw new ForbiddenRequestError('Forbidden Error');
    }

    const objKey = await findById(key);
    if (!objKey) {
        throw new ForbiddenRequestError('Forbidden Error');
    }
    req.objKey = objKey;
    return next();
}

const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            throw new ForbiddenRequestError('Permission Deny');
        }

        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            throw new ForbiddenRequestError('Permission Deny');
        }

        return next();
    }
}

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = {
    apiKey,
    checkPermission,
    asyncHandler
};