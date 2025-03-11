'use strict'
const { insertData, checkExistence } = require("../helpers/dynamodb.helper");
const userSchema = require("../models/user.model");
const { validatePhone, validateEmail } = require("../validate");
const CryptoJS = require("crypto-js");


const findByEmail = async ({ email, select = {
    email: 1, password: 2, name: 1, status: 1, roles: 1
} }) => {
    return await userSchema.findOne({ email }).select(select).lean();
}

const checkExitEmail = async ({email}) => {
    let validate = validateEmail(email);
    if (!validate) {
        return -1;
    }
    const emailExist = await checkExistence("CustomerMaster", { EmailAddress: email });
    console.log(`Email Exit: ${email}`);
    return emailExist
}

const checkExitPhone = async ({phone}) => {
    let validate = validatePhone(phone);
    if (!validate) {
        return -1;
    }
    const phoneExist = await checkExistence("CustomerMaster", { PhoneNumber: phone });
    console.log(`Phone Number Exit: ${phone}`);
    return phoneExist
}

// 🛠️ Add customer function
const addCustomer = async ({email, phone, password}) => {
    // Validate email and phone
    validateEmail(email);
    validatePhone(phone);

    // Hash password using SHA-256
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

    // Get current time
    const now = new Date().toISOString();

    // Create customer object
    const customer = {
        EmailAddress: email,
        PhoneNumber: phone,
        Password: hashedPassword,
        CreatedDate: now,
        UpdatedDate: now,
    };

    // Add customer to CustomerMaster table (assuming addCustomerToDB function exists)
    await insertData("CustomerMaster", customer);

    return customer;
};

module.exports = {
    findByEmail,
    checkExitEmail,
    checkExitPhone,
    addCustomer,
};