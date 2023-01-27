import { Router } from 'express';
import { ERRORS } from '../constants/errors.js';
import { cartManager } from '../dao/manager/index.js';

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

        const searchProduct = await CartModel.findOne({"products.product": productId})

        if(searchProduct) {
            const result = await cartManager.updateQuantity(cartId, productId, 1);
            const showCart = await cartManager.getCartById(cartId);
            
        }
    
        const result = await cartManager.addProduct(cartId, productId);
    
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