'use strict'
const userSchema = require('../models/user.model');
const bcrypt = require('bcrypt');
const Role = {
    Customer: 'CUS',
    Admin: 'ADM',
    Root: 'RO'
}
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../utils/auth.utils');
const { getInfoData } = require('../utils/index');
const { ConflictRequestError, ForbiddenRequestError } = require('../core/error.response');
const { OK, CREATED } = require('../core/success.response');

class AuthService {

    static signUp = async ({ name, email, password }) => {
        const user = await userSchema.findOne({ email }).lean();
        if (user) {
            throw new ConflictRequestError('Shop already registered');
        };

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await userSchema.create({
            name, email, password: passwordHash, roles: [Role.Root]
        });

        if (newUser) {
            const publicKey = crypto.randomBytes(64).toString('hex');
            const privateKey = crypto.randomBytes(64).toString('hex');

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser._id,
                publicKey: publicKey,
                privateKey: privateKey
            });

            if (!keyStore) {
                throw new ForbiddenRequestError('PublicKeyString Error');
            }

            const tokens = await createTokenPair({ userId: newUser._id, email }, publicKey, privateKey);
            console.log('Create Token Success:', tokens);

            return new CREATED({
                metadata: {
                    user: getInfoData({ fields: ['_id', 'name', 'email'], object: newUser }),
                    tokens
                }
            })
        }

        return new OK()
    }
}


module.exports = AuthService