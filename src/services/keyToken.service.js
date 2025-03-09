'use strict'

const keyTokenSchema = require('../models/keytoken.model');

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        const filter = {user: userId}, update = {
            publicKey, privateKey, refreshTokensUsed: [], refreshToken
        }, options = { upsert: true, new: true}
        const tokens = await keyTokenSchema.findOneAndUpdate(filter, update, options)
        return tokens ? tokens.publicKey : null;
    }
}

module.exports = KeyTokenService;