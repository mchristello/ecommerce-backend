import { ERRORS } from "../../constants/errors.js";
import { GeneralError, MissingInputsError, NotFoundError, ValidationError } from "../../utils/error.utils.js";
import {ProductModel} from "../models/Product.js";



export class ProductManager {

    // Product Manager
    getProducts = async(options, query) => {
        try {
            const search = {}
            if(query) {
                search["$or"] = [
                    {title: {$regex: query }},
                    {description: {$regex: query }},
                    {category: {$regex: query }},
                ]
                const products = await ProductModel.paginate( search, options );
                return products;
            }

            const products = await ProductModel.paginate({}, options );
            return products;

        } catch (error) {
            if(error.message === NotFoundError){
                throw new NotFoundError(`We couldn't find any product in our database`)
            }
        }
    }

    findProducts = async(data) => {
        try {
            const filteredProducts = await ProductModel.find({_id: data}).lean().exec();
            if(!filteredProducts){
                throw new NotFoundError(`The Product does not exist in our database, please check again.`)
            }
            return filteredProducts;
            
        } catch (error) {
            console.log(`Cannot fin the product you are looking for: ${error.message}`);
        }
    }

    newProduct = async(data) => {
        try {
            const newProduct = await ProductModel.create(data);
            console.log(`New product added to the DB: ${newProduct.description}`);
            return newProduct;

        } catch (error) {
            throw new MissingInputsError(`There is/are some inputs missing`);
        }
    }

    updateProduct = async(id, data) => {
        try {
            const updateProduct = await ProductModel.updateOne({_id: id}, data);
            console.log(`The product ${updateProduct.description} has been updated`);
            return updateProduct;

        } catch (error) {
            if (error.message === ERRORS.MISSING_INPUTS) {
                throw new MissingInputsError(`There is/are some inputs missing`);
            }
            if (error.message === ERRORS.NOT_FOUND_ERROR) {
                throw new NotFoundError(`We couldn't find the product ${updateProduct.description}`);                
            }
        }
    }

    deleteProduct = async(id) => {
        try {
            const productToDelete = await ProductModel.deleteOne({_id: id});
            console.log(`The product has been deleted`);
            return productToDelete;

        } catch (error) {
            throw new NotFoundError(`We couldn't find the product with the id ${id}`);                
        }
    }
}
