'use strict'

const keyTokenSchema = require('../models/keytoken.model');

class KeyTokenService{

    static createKeyToken = async ({userId, publicKey, privateKey}) =>{
        try{
            console.log(userId);
            const tokens = await keyTokenSchema.create({
                userId: userId,
                publicKey: publicKey,
                privateKey: privateKey
            });
            return tokens ? tokens.publicKey : null;
        }catch(error){
            return error;
        }
    }
}

module.exports = KeyTokenService;