import { ERRORS } from "../constants/errors.js";



export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = ERRORS.VALIDATION_ERROR;
    }
}

export class NotFoundError extends Error {
    constructor (message) {
        super(message);
        this.name = ERRORS.NOT_FOUND_ERROR;
    }
}

export class MissingInputsError extends Error {
    constructor (message) {
        super(message);
        this.name = ERRORS.MISSING_INPUTS;
    }
}

export class NoStockError extends Error {
    constructor (message) {
        super(message);
        this.name = ERRORS.NO_STOCK;
    }
}

export class GeneralError extends Error {
    constructor (message) {
        super(message);
        this.name = ERRORS.GENERAL_ERROR;
    }
}

export class NoAuthenticationError extends Error {
    constructor (message) {
        super(message);
        this.name = ERRORS.NOT_AUTHENTICATION_ERROR;
    }
}