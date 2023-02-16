import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import config from '../config/config.js';


// * hashSync: toma el poassword y salt para "hashear"
// * genSaltSync: Genera un salt (Un string aleatorio)

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
};


// Config de JWT
// export const PRIVATE_KEY = 'B@sti4n2021_qwer1234(From?MatCH';

export const generateToken = (user) => {
    const token = jwt.sign({user}, config.PRIVATE_KEY, {expiresIn: '24h'})

    return token
}

export const authToken = (req, res, next) => {
    const authToken = req.cookies.coderCookieToken;

    if(!authToken) {
        return res.status(401).render('errors/general', {
            style: 'style.css',
            error: 'No authentication.'
        });
    }

    jwt.verify(token, config.PRIVATE_KEY, (error, credentials) => {
        if(error) {
            return res.status(403).render('errors/general', {
                style: 'style.css',
                error: 'No authorizations.'
            });
        }
        req.user = credentials.user;
        next();
    })
}

export const passportCall = (strategyName) => {
    return async (req, res, next) => {
        passport.authenticate(strategyName, function(err, user, info) {
            if(err) {
                return res.status(401).render('errors/general', {
                    style: 'style.css',
                    error: info.message ? info.message : info.toString()
                });
            }

            req.user = user;
            next();
        })(req, res, next);
    }
}