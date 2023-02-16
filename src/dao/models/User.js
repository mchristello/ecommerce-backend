import mongoose from "mongoose";

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: String, 
    last_name: String,
    email: {
        unique: true,
        type: String
    },
    password: String,
    rol: {
        type: String,
        default: 'user'
    },
    age: {
        type: Number,
        default: ''
    },
    carts: {
        type: [
            {
                cart: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'carts',
                },
            }
        ],
        default: []
    }
});

userSchema.pre('findOne', function() {
    this.populate('carts.cart')
})

export const UserModel = mongoose.model(userCollection, userSchema);