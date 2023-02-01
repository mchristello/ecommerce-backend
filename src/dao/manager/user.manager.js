import { NotFoundError, ValidationError } from "../../utils/error.utils.js";
import { UserModel } from "../models/User.js";



export class UserManager {

    // User Manager
    getAllUsers = async() => {
        try {
            const allUsers = await UserModel.find().lean().exec();
            return allUsers;

        } catch (error) {
            if(error.message === NotFoundError){
                throw new NotFoundError(`We couldn't find any product in our database`)
            }
        }
    }

    getUser = async(data) => {
        try {
            const userSearched = await UserModel.findOne({ email: data});
            return userSearched;

        } catch (error) {
            if(error.message === NotFoundError){
                throw new NotFoundError(`We couldn't find any user in our database`)
            }
        }
    }

    getById = async(id) => {
        const user = await UserModel.findById(id);
        return user
    }

    createUser = async(data) => {
        try {
            const newUser = await UserModel.create(data)
            return newUser;

        } catch (error) {
            if(error.message === ValidationError){
                throw new ValidationError(`Sorry...We could'n create the user. Please check the info.`)
            }
        }
    }

    updateUser = async(userEmail, cartId) => {
        try {
            const findCart = await UserModel.findOne({ "carts.cart": cartId });

            if(findCart) {
                const updateCart = await UserModel.updateOne({ "carts.cart": cartId }, cartId );
                const newUser = await UserModel.findOne({ email: userEmail })
                console.log(`Revisando el update del user: `, JSON.stringify(newUser, null, 2, `\t`));

                return updateCart;
            }

            user.carts.push({ cart: cartId });
            
            const result = await UserModel.updateOne({ email: userEmail }, user);
            
            return result;

        } catch (error) {
            if(error.message === NotFoundError){
                throw new NotFoundError(`We couldn't find the user in our database`)
            }
        }
    }

}