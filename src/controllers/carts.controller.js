import { ERRORS } from "../constants/errors.js";
import CartsService from "../services/carts.service.js";



export default class CartsController {

    constructor() {
        this.cartsService = new CartsService()
    }

    getAll = async(req, res) => {
        try {
            const result = await this.cartsService.getAll();

            return res.sendSuccess({ result })
        } catch (error) {
            return res.sendServerError({ error: error });
        }
    }

    getById = async(req, res) => {
        try {
            const cid = req.params.cid;
            const result = this.cartsService.getById(cid);

            return res.sendSuccess({ result })
        } catch (error) {
            return res.sendServerError({ error: error });
        }
    }

    create = async(req, res) => {
        try {
            const result = await this.cartsService.create();

            return res.sendSuccess({ result })
        } catch (error) {
            return res.sendServerError({ error: error });
        }
    }

    addProduct = async(req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;

            const result = await this.cartsService.addProduct(cartId, productId);

            return res.sendSuccess({ result });
        } catch (error) {
            if (error.name === ERRORS.GENERAL_ERROR) {
                return res.sendServerError({ error: error.message });
            }
            res.sendServerError({error: error});
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const { cid, pid } = req.params;

            const result = await this.cartsService.deleteProduct(cid, pid);

            return res.sendSuccess({ result });
        } catch (error) {
            if (error.name === ERRORS.NOT_FOUND_ERROR) {
                return res.sendServerError({ error: `${error.name}: ${error.message}` });
            }
            return res.sendServerError(error);
        }
    }

    deleteAll = async (req, res) => {
        try {
            const cartId = req.params.cid;

            const result = await this.cartsService.deleteAll(cartId);
            
            return res.sendSuccess({ result });
        } catch (error) {
            if (error.name === ERRORS.NOT_FOUND_ERROR) {
                return res.sendServerError({ error }).redirect('/errors/general', { 
                    style: 'style.css',
                    error: error
                });
            }
            return res.sendServerError(error);
        }
    }

}