import * as dotenv from 'dotenv';
dotenv.config()
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const PRIVATE_KEY = process.env.PRIVATE_KEY; // Key para JWT

// * hashSync: toma el poassword y salt para "hashear"
// * genSaltSync: Genera un salt (Un string aleatorio)

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
};


// Se genera el Token con JWT
export const generateToken = (user) => {
    const token = jwt.sign( {user}, PRIVATE_KEY, {expiresIn: '24h'} );

    return token
};

// Verificar la authenticacion con token
export const authToken = (req, res, next) => {
    const authHeader = req.headers.auth;
    if(!authHeader) {
        return res.status(401).send({ error: "No Authentication" });
    };

    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if(error) {
            return res.status(403).send({ error: "Not Authorized" })
        };

        req.user = credentials.user;
        next();
    });
};

// Manejo de errores de Passport 
export const passportCall = (strategyName) => {
    return async (req, res, next) => {
        passport.authenticate(strategyName, function (err, user, info) {
            if(err) return next(err);
            if(!user) {
                return res.status(401).send({
                    error: info.message ? info.message : info.toString()
                })
            }

            req.res = user;
            next();
        })(req, res, next);
    }
};