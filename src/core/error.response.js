'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    AUTHENTICATION: 401,
    BADREQUEST: 404,
    CONFLICT: 409
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    BADREQUEST: 'Bad request error',
    AUTHENTICATION: 'Authentication error',
    CONFLICT: 'Conflict error'
}

class ErrorResponse extends Error{
    constructor(message, status){
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.CONFLICT, status = StatusCode.CONFLICT){
        super(message, status);
    }
}

class ForbiddenRequestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.FORBIDDEN, status = StatusCode.FORBIDDEN){
        super(message, status);
    }
}

class BadRequestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.BADREQUEST, status = StatusCode.BADREQUEST){
        super(message, status);
    }
}

class AuthenticationRequestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.AUTHENTICATION, status = StatusCode.AUTHENTICATION){
        super(message, status);
    }
}

module.exports = {
    ConflictRequestError,
    ForbiddenRequestError,
    BadRequestError,
    AuthenticationRequestError
}