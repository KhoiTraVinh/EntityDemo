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
const {createTokenPair} = require('../utils/auth.utils');
const {getInfoData} = require('../utils/index');

class AuthService{
    
    static signUp = async ({ name, email, password }) => {
        try{
            const user = await userSchema.findOne({email}).lean();
            if(user)
            {
                return {
                    code: 'xxxx',
                    message: 'Shop already registered'
                }
            };

            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = await userSchema.create({
                name, email, password: passwordHash, roles: [Role.Root]
            });

            if(newUser)
            {
                const publicKey = crypto.randomBytes(64).toString('hex');
                const privateKey = crypto.randomBytes(64).toString('hex');
                
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newUser._id,
                    publicKey: publicKey,
                    privateKey: privateKey
                });

                if(!keyStore)
                {
                    return {
                        code: 'xxxxx',
                        message: 'publicKeyString Error'
                    };
                }

                const tokens = await createTokenPair({userId: newUser._id, email}, publicKey, privateKey);
                console.log('Create Token Success: %d', tokens);

                return {
                    code: 201,
                    metadata: {
                        user: getInfoData({fields: ['_id', 'name', 'email'], object: newUser}),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }

        }catch(error){
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            };
        }
    }
}


module.exports = AuthService