'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const AuthService = require("../services/auth.service");

class AuthController{

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AuthService.login(req.body)
        }).send(res);
    };

    signUp = async (req, res, next) => {
        new CREATED({
            message: "Registered OK!",
            metadata: await AuthService.signUp(req.body),
            options: {}
        }).send(res);
    }
}

module.exports = new AuthController();