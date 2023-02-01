import { Router } from 'express';
import { ERRORS } from '../constants/errors.js';
import { cartManager, userManager } from '../dao/manager/index.js';
import { CartModel } from '../dao/models/Cart.js';

const router = Router();


// GET 
// Get All Carts 
router.get('/', async (req, res) => {
    const allCarts = await cartManager.getCarts();

    res.send({ Status: 'Success', payload: (allCarts.length > 0) ? allCarts : `There's no cart to show` });
});

// Get Cart by _id
router.get('/:cid', async (req, res) => {
    try {
            const { cid } = req.params;
        
            const searchedCart = await cartManager.getCartById(cid);      
        
            res.send({ Status: 'Success', payload: searchedCart });
        
    } catch (error) {
        if(error.name === ERRORS.NOT_FOUND_ERROR) {
            return res.send({ Success: false, Error: `${error.name}: ${error.message}` });
        }
        console.log(`Ups: Something Wrong just happened: ${error.message}`);
    }
});

// POST 
// Create a new cart
router.post('/', async (req, res) =>{
    try {
        const newCart = req.body;

        const result = await cartManager.createNewCart(newCart);

        // Actualizando carrito del usuario
        const user = req.session.user;        
        const updateUser = await userManager.updateUser(user.email, newCart);
    
        res.send({ Status: 'Success', Message: `A new cart has been created`, payload: result });
    } catch (error) {
        if (error.name === ERRORS.VALIDATION_ERROR) {
            return res.send({ Success: false, Error: `${error.name}: ${error.message}` });
        }
        console.log(`Ups: Something Wrong just happened: ${error.message}`);
    }
});

// Add products to cart
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;        
        const user = req.session.user;  
        
        const searchProduct = await CartModel.findOne({"products.product": productId});
        
        if(searchProduct) {
            const result = await cartManager.updateQuantity(cartId, productId, 1);

            // Actualizando carrito del usuario
            const updatedUser = await userManager.updateUser(user.email, cartId);

            const showCart = await cartManager.getCartById(cartId);
            return res.send({ Status: 'Success', Message: `The product has been added to the cart.`, payload: showCart });
        }
        
        const result = await cartManager.addProduct(cartId, productId);        
        
        // Actualizando carrito del usuario
        const updatedUser = await userManager.updateUser(user.email, cartId);

        const checkUser = await userManager.getUser(user.email)
        console.log(`Checking the user to see if it's been updated: `, JSON.stringify(checkUser, null, 2, `\t`));


        const showCart = await cartManager.getCartById(cartId);

    
        res.send({ Status: 'Success', Message: `The product has been added to the cart.`, payload: showCart });
        
    } catch (error) {
        if (error.name === ERRORS.MISSING_INPUTS) {
            return res.send({ Success: false, Error: `${error.name}: ${error.message}` });
        }
        if (error.name === ERRORS.GENERAL_ERROR) {
            return res.send({ Success: false, Error: `${error.name}: ${error.message}` });
        }
        console.log(`Ups: Something Wrong just happened: ${error.message}`);
    }
});

// DELETE
// Delete all products from a selected cart.
router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const searchedCart = await cartManager.deleteAllProducts(cartId);
    
        const showCart = await cartManager.getCartById(cartId);

        // Actualizando carrito del usuario
        const user = req.session.user;        
        const updateUser = await userManager.updateUser(user.email, cartId);
    
        res.send({ Status: 'Success', payload: showCart });
        
    } catch (error) {
        if (error.name === ERRORS.NOT_FOUND_ERROR) {
            return res.send({ Success: false, Error: `${error.name}: ${error.message}` });
        }
        console.log(`Ups, something happened that shouldn't supouse to: ${error.message}`);
    }
})

// Delete one product from a selected cart.
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const searchedCart = await cartManager.getCartById(cartId);
    
        if(!searchedCart) {
            res.status(404).send({ Status: "Failed", Message: `We couldn't find the cart you requested` });
        }
    
        const productId = req.params.pid;
        const searchedProduct = await cartManager.deleteFromCart(cartId, productId);
    
        const actualizedCart = await cartManager.getCartById(cartId);

        // Actualizando carrito del usuario
        const user = req.session.user;        
        const updateUser = await userManager.updateUser(user.email, cartId);
    
        res.send({ Status: 'Success', Message: `The product has been deleted from the cart`, payload: actualizedCart });
    
        if(!searchedProduct) {
            res.status(404).send({ Status: "Failed", Message: `We couldn't find the product you requested` });
        }
    } catch (error) {
        if (error.name === ERRORS.NOT_FOUND_ERROR) {
            return res.send({ Success: false, Error: `${error.name}: ${error.message}` });
        }
        console.log(`Ups, something happened that shouldn't supouse to: ${error.message}`);
    }
})

export default router;