'use strict'

const { CREATED } = require("../core/success.response");
const AuthService = require("../services/auth.service");

class AuthController{

    signUp = async (req, res, next) => {
        new CREATED({
            message: "Registered OK!",
            metadata: await AuthService.signUp(req.body),
            options: {}
        }).send(res);
    }
}

module.exports = new AuthController();