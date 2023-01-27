import { GeneralError, NotFoundError, ValidationError } from "../../utils/error.utils.js";
import { CartModel } from "../models/Cart.js";


export class CartManager {

    // Cart Manager 
    getCarts = async () => {
        try {
            const allCarts = await CartModel.find();
            return allCarts;
        } catch (error) {
            throw new NotFoundError(`We couldn't find any cart`);                
        }
    }

    getCartById = async (id) => {
        try {
            const cart = await CartModel.find({ _id: id }).lean().exec();
            return cart;

        } catch (error) {
            throw new NotFoundError(`Couldn't find the cart with the id ${id} in te DB.`)
        }
    }

    createNewCart = async(data) => {
        try {
            const newCart = await CartModel.create(data);

            return newCart;
        } catch (error) {
            throw new ValidationError(`Sorry...We could'n create your cart. Please try again.`)
        }
    }

    addProduct = async(cid, pid) => {
        try {
            const findCart = await CartModel.findOne({ _id: cid });
    
            if (!findCart) {
                throw new NotFoundError(`Couldn't find the cart with the id ${id} in te DB.`)
            }
            
            const findProduct = await CartModel.findOne({ "products.product": pid });
    
            if (findProduct) {
                const updateQuantity = await CartModel.updateOne({ "products.product": pid }, { $inc: { "product.$.quantity": 1 }});
    
                return updateQuantity
            }
    
            findCart.products.push({ product: pid, quantity: 1 });
    
            let result = await CartModel.updateOne({ _id: cid }, findCart );
    
            return result;            
        } catch (error) {
            throw new GeneralError(`Sorry...We could'n add the product to your cart. Please try again.`)            
        }
    }

    updateQuantity = async(cid, pid, qty) => {
        try {
            const searchedCart = await CartModel.find({ _id: cid });
    
            const updateQuantity = await CartModel.updateOne({ "products.product": pid }, { $inc: { "products.$.quantity": qty }});
    
            return updateQuantity;            
        } catch (error) {
            throw new GeneralError(`Sorry...We could'n update the product. Please try again.`) 
        }
    }

    deleteFromCart = async (cid, pid) => {
        try {
            const deleteProduct = await CartModel.updateOne({ _id: cid}, { $pull: { products: { product: pid }}});
        
            return deleteProduct;
            
        } catch (error) {
            throw new NotFoundError(`Couldn't find the product of your cart.`)
        }
    }

    deleteAllProducts = async(cid) => {
        const deleteAll = await CartModel.updateOne({ _id: cid }, { products: [] });

        return deleteAll;
    }
}