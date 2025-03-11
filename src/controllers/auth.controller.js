'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const AuthService = require("../services/auth.service");
const { addCustomer, checkExitEmail, checkExitPhone } = require("../services/user.service");

class AuthController{

    // login = async (req, res, next) => {
    //     new SuccessResponse({
    //         metadata: await AuthService.login(req.body)
    //     }).send(res);
    // };

    // signUp = async (req, res, next) => {
    //     new CREATED({
    //         message: "Registered OK!",
    //         metadata: await AuthService.signUp(req.body),
    //         options: {}
    //     }).send(res);
    // }

    checkExistEmail = async (req, res, next) => {
        new SuccessResponse({
            metadata: await checkExitEmail(req.body)
        }).send(res);
    };

    checkExistPhone = async (req, res, next) => {
        new SuccessResponse({
            metadata: await checkExitPhone(req.body)
        }).send(res);
    };

    addCustomer = async (req, res, next) => {
        new CREATED({
            message: "Registered OK!",
            metadata: await addCustomer(req.body),
            options: {}
        }).send(res);
    }


}

module.exports = new AuthController();