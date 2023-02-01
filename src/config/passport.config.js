import * as dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import GoogleStrategy from 'passport-google-oauth2';
import jwt from 'passport-jwt';
import { userManager } from '../dao/manager/index.js';
import { createHash, isValidPassword } from '../utils/utils.js';
import { UserModel } from '../dao/models/User.js';


const LocalStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = req => {
    const token = (req && req.cookies) ? req.cookies['ecommerceCookieToken'] : null;

    return token;
}

const initializePassport = () => {

    // Logica de passport para crear usuario
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email } = req.body;
            try {
                const user = await userManager.getUser(username);
                if(user) {
                    console.log(`Already exists a user with email: ${username}`);
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name, 
                    email,
                    password: createHash(password)
                }
                
                const result = new UserModel(newUser);

                if (result.email === 'adminCoder@coder.com' || 'm.christello@hotmail.com') {
                    result.rol = 'admin';
                    await result.save();
                    return done(null, result);
                }

                await result.save();
                return done(null, result);

            } catch (error) {
                return done(`There's been an error when registering:`, error.message);
            }
        }
    ));

    // Logica de login con GitHub
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.137989e66e9eb817',
            clientSecret: 'c81861470033eea4fb78afa6856b62da18edb425',
            callbackURL: 'http://localhost:8080/sessions/github-callback'
        },
        async(accessToken, refreshToken, profile, done) => {
            console.log(`This is the PROFILE that returns GitHub: `, profile);
            try {
                const user = await userManager.getUser(profile._json.email);
                if(user) {
                    console.log(`Already exists a user with that email: `, user);
                    return done(null, user);
                }

                const newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    password: "",
                    rol: (profile._json.email === 'adminCoder@coder.com' || 'm.christello@hotmail.com') ? 'admin' : 'user'
                }

                const result = await userManager.createUser(newUser);
                return done(null, result)

            } catch (error) {
                return done(`Ther's been an error authenticating with GitHub: `, error)
            }
        }
    ))

    // Logica de passport para login con Google.
    passport.use('google', new GoogleStrategy(
        {
            clientID: "254076352422-se3s5phvpsusol1ijpng3gj1d9efhn7s.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:8080/sessions/google-callback",
            passReqToCallback: true
        },
        async(request, accessToken, refreshToken, profile, done) => {
            console.log(`This is the PROFILE that returns Google: `, profile); // Ver la info de perfir que devuelve Google
            try {
                const user = await userManager.getUser(profile._json.email)
                if(user) {
                    console.log(`Already exists a user with email ${profile._json.email}`);
                    return done(null, user);
                }

                const newUser = {
                    first_name: profile._json.given_name,
                    last_name: profile._json.family_name,
                    email: profile._json.email,
                    password: "",
                    rol: (profile._json.email === 'adminCoder@coder.com' || 'm.christello@hotmail.com') ? 'admin' : 'user'
                }

                const result = await userManager.createUser(newUser);
                return done(null, result)

            } catch (error) {
                return done(`Ther's been an error authenticating with Google: `, error)
            }
        }
    ))

    // Logica de passport para iniciar sesión local
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async(username, password, done) => {
            try {
                const user = await userManager.getUser(username);
                if (!user) {
                    console.error(`The user doesn't exist.`);
                    return done(null, false);
                }

                if(!isValidPassword(user, password)) {
                    return done(null, false);
                }

                return done(null, user);
            } catch (error) {
                return done(`Hubo un error con el login:`, error);
            }
        }
    ));

    // Lógica de passport con JWT
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.PRIVATE_KEY
    },
    async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        };
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userManager.getById(id)
        done(null, user)
    })
}

export default initializePassport;