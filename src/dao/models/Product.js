import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    thumbnail: String,
    category: String,
    price: Number,
    code: {
        type: String,
        unique: true,
    },
    status: Boolean,
    stock: Number
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model(productCollection, productSchema);