import { GeneralError, NotFoundError } from '../../utils/error.utils.js';
import { CartModel } from '../models/cart.js';

export class CartManager {

    getCarts = async () => {
        try {
            const allCarts = await CartModel.find();
            return allCarts;
        } catch (error) {
            throw new NotFoundError(`We couldn't find any cart`);                
        }
    }

    getCartById = async(id) => {
        try {
            const cart = await CartModel.find({ _id: id }).lean().exec();
            return cart
        } catch (error) {
            throw new NotFoundError(`Couldn't find the cart in the DB.`)
        }
    }

    createCart = async(data) => {
        try {
            const newCart = await CartModel.create(data)
            return newCart
        } catch (error) {
            throw new GeneralError(`Couldn't create the cart, please try again.`)
        }
    }

    addProduct = async(cartId, productId) => {
        try {
            const findCart = await CartModel.findOne({_id: cartId });
            if(!findCart) throw new NotFoundError(`Couldn't find the cart with the id ${cartId}.`)

            const findProduct = await CartModel.findOne({ 'products.product': productId });
            if(findProduct) {
                const updateQuantity = await this.updateQuantity(cartId, productId, 1)
                return updateQuantity
            }

            findCart.products.push({ product: productId, quantity: 1 });

            let result = await CartModel.updateOne({ _id: cartId }, findCart)
            return result;

        } catch (error) {
            throw new GeneralError(`Ups! Something went wrong, please try again.`);
        }
    }

    updateQuantity = async(cid, pid, qty) => {
        try {
            const updateQty = await CartModel.updateOne({ 'products.product': pid }, { $inc: { 'products.$.quantity': qty }});

            return updateQty;

        } catch (error) {
            throw new GeneralError(`Ups! Something went wrong, please try again.`);
        }
    }

    deleteProduct = async(cid, pid) => {
        try {
            const deleteProduct = await CartModel.updateOne({ _id: cid }, { $pull: { products: { product: pid }}});

            return deleteProduct;
        } catch (error) {
            throw new NotFoundError(`Ups! Something went wrong, please try again.`)
        }
    }

    emptyCart = async(cid) => {
        const emptyCart = await CartModel.updateOne({ _id: cid }, { products: [] });

        return emptyCart;
    }
}