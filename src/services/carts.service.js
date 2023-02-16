import { cartManager } from "../dao/managers/index.js"


export default class CartsService {

    constructor() {

    }

    getAll = async() => {
        try {
            const allCarts = await cartManager.getCarts();
            return allCarts;
        } catch (error) {
            return console.error(error);
        }
    }

    getById = async(cid) => {
        try {
            const myCart = await cartManager.getCartById(cid);
            return myCart;
        } catch (error) {
            return console.error(error);
        }
    }

    create = async() => {
        try {
            const newCart = await cartManager.createCart();
            return newCart;
        } catch (error) {
            return console.error(error);
        }
    }

    addProduct = async (cid, pid) => {
        try {        
            const addProduct = await cartManager.addProduct(cid, pid);
            const showCart = await cartManager.getCartById(cid);

            return showCart;
                
        } catch (error) {
            return console.error(error);
        }
    }

    deleteProduct = async(cid, pid) => {
        try {
            const searchedCart = await cartManager.getCartById(cartId);
            if(!searchedCart) {
                throw new Error(`Sorry, we couldn't find the cart, please try again later.`);
            }
        
            const searchedProduct = await cartManager.deleteProduct(cartId, productId); 
            if(!searchedProduct) {
                throw new Error(`Sorry, we couldn't find the product you requested`);
            }
            
            const actualizedCart = await cartManager.getCartById(cartId);

            return actualizedCart;

        } catch (error) {
            return console.error(error);
        }
    }

    deleteAll = async (cid) => {
        try {
            const searchedCart = await cartManager.deleteAllProducts(cartId);            
            const showCart = await cartManager.getCartById(cartId);

            return showCart;
        } catch (error) {
            return console.error(error);            
        }
    }
}