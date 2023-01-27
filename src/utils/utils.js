import bcrypt from 'bcrypt';

// * hashSync: toma el poassword y salt para "hashear"
// * genSaltSync: Genera un salt (Un string aleatorio)

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
};


