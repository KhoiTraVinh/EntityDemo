'use strict'

const userSchema = require("../models/user.model")


const findByEmail = async ({email, select = {
    email: 1, password: 2, name: 1, status: 1, roles: 1
}}) => {
    return await userSchema.findOne({email}).select(select).lean();
}

const checkExitsEmailAndPhone = async ({email, phone}) => {
    if(email)
    {
        const emailExists = await checkExistence("CustomerMaster", { EmailAddress: email });
        console.log(`Email tồn tại: ${emailExists}`);
    }
    if(phone)
    {
        const phoneExists = await checkExistence("CustomerMaster", { PhoneNumber: phone });
        console.log(`Phone Number tồn tại: ${phoneExists}`);
    }

    return emailExists || phoneExists
}

module.exports = {
    findByEmail,
    checkExitsEmailAndPhone
};