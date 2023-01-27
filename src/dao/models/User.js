import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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
    carts: {
        type: Array,
        default: []
    },
});

// userSchema.pre('findOne', function () {
//     this.populate('carts.cart')
// });

userSchema.plugin(mongoosePaginate);

export const UserModel = mongoose.model(userCollection, userSchema);
