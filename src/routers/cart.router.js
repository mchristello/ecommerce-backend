import { ERRORS } from "../constants/errors.js";
import { cartManager } from "../dao/managers/index.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import MyRouter from "./router.js";

export default class CartRouter extends MyRouter {

    init() {
        // GET Carts
        this.get('/', async (req, res) => {
            try {
                const allCarts = await cartManager.getCarts();
                
                return res.sendSuccess({ allCarts });
            } catch (error) {
                return res.sendServerError({ error: error.message });
            }
        });

        // GET cart by ID
        this.get('/:cid', AuthMiddleware.isAuthenticated, async (req, res) => {
            try {
                const cid = req.params.cid;
                const myCart = await cartManager.getCartById(cid);

                return res.sendSuccess({ myCart })
            } catch (error) {
                return res.sendServerError({error})
            }
        });

        // POST create cart
        this.get('/', async (req, res) => {
            try {
                const newCart = await cartManager.createCart();

                return res.sendSuccess({ newCart })
            } catch (error) {
                
            }
        });

        // Add products to cart
        this.post('/:cid/products/:pid', async (req, res) => {
            try {
                const cartId = req.params.cid;
                const productId = req.params.pid;
            
                const result = await cartManager.addProduct(cartId, productId);
                const showCart = await cartManager.getCartById(cartId);
            
                res.sendSuccess({ showCart });
                
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // DELETE
        // Delete all products from a selected cart.
        this.delete('/:cid', async (req, res) => {
            try {
                const cartId = req.params.cid;
                const searchedCart = await cartManager.deleteAllProducts(cartId);
            
                const showCart = await cartManager.getCartById(cartId);
            
                res.sendSuccess({ showCart });
                
            } catch (error) {
                if (error.name === ERRORS.NOT_FOUND_ERROR) {
                    return res.sendServerError({ error }).redirect('/errors/general', { 
                        style: 'style.css',
                        error: error
                    });
                }
                return res.sendServerError(error);
            }
        })

        // Delete one product from a selected cart.
        this.delete('/:cid/products/:pid', async (req, res) => {
            try {
                const cartId = req.params.cid;
                const searchedCart = await cartManager.getCartById(cartId);
            
                if(!searchedCart) {
                    res.sendServerError({ error: `We couldn't find the cart you requested` });
                }
            
                const productId = req.params.pid;
                const searchedProduct = await cartManager.deleteProduct(cartId, productId);
            
                const actualizedCart = await cartManager.getCartById(cartId);
            
                res.sendSuccess({ actualizedCart });
            
                if(!searchedProduct) {
                    res.sendServerError({ error: `We couldn't find the product you requested` });
                }
            } catch (error) {
                if (error.name === ERRORS.NOT_FOUND_ERROR) {
                    return res.sendServerError({ error: `${error.name}: ${error.message}` });
                }
                res.sendServerError(error);
            }
        })
    }
}