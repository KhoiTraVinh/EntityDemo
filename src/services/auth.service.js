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
const { ConflictRequestError, ForbiddenRequestError, BadRequestError, AuthenticationRequestError } = require('../core/error.response');
const { OK, CREATED } = require('../core/success.response');
const { findByEmail } = require('../services/user.service');

class AuthService {

    static login = async ({ email, password, refreshToken = null }) => {

        const user = await findByEmail({ email });
        if (!user) {
            throw new BadRequestError('User not registered');
        }

        const match = bcrypt.compare(password, user.password);
        if (!match) {
            throw new AuthenticationRequestError('Authentication error');
        }

        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');
        const tokens = await createTokenPair({ userId: user._id, email }, publicKey, privateKey);
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            publicKey: publicKey,
            privateKey: privateKey
        });
        return {
            user: getInfoData({ fields: ['_id', 'name', 'email'], object: user }),
            tokens
        }
    };


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

            return {
                user: getInfoData({ fields: ['_id', 'name', 'email'], object: newUser }),
                tokens
            }
        }

        throw new OK()
    };
}


module.exports = AuthService