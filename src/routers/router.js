import { Router } from 'express';


export default class MyRouter {

    constructor() {
        this.router = Router()
        this.init()
    }

    getRouter() {
        return this.router;
    }

    init() {}
    
    get(path, ...callbacks) {
        this.router.get(path, this.generateCoustomResponses, this.applyCallbacks(callbacks));
    }

    post(path, ...callbacks) {
        this.router.post(path, this.generateCoustomResponses, this.applyCallbacks(callbacks));
    }
    
    put(path, ...callbacks) {
        this.router.put(path, this.generateCoustomResponses, this.applyCallbacks(callbacks));
    }
    
    delete(path, ...callbacks) {
        this.router.delete(path, this.generateCoustomResponses, this.applyCallbacks(callbacks));
    }

    applyCallbacks(callback) {
        return callback.map((cb) => async(...params) => {
            try {
                await cb.apply(this, params)
            } catch (error) {
                params[1].satus(500).send(error);
            }
        })
    }

    generateCoustomResponses = (req, res, next) => {
        res.sendSuccess = (payload) => res.status(200).send({ status: 'success', result: payload});
        res.sendSuccessPost = (payload) => res.status(201).send({ status: 'success', result: payload});
        res.sendAuthenticationError = (error) => res.status(401).send({ status: 'error', result: error });
        res.sendAuthorizationError = (error) => res.status(403).send({ status: 'error', result: error });
        res.sendServerError = (error) => res.status(500).send({ status: 'error', result: error });

        next();
    }

}