import passport from "passport";
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import GoogleStrategy from 'passport-google-oauth2';
import jwt from 'passport-jwt';
import { createHash, generateToken, isValidPassword } from "../utils/index.js";
import config from "./config.js";
import { userManager } from "../dao/managers/index.js";
import { UserModel } from "../dao/models/User.js";


const LocalStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = req => {
    const token = (req && req.cookies) ? req.cookies[config.COOKIE_NAME] : null;

    return token;
}

const initializePassport = () => {

    // Register
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    },
    async (req, username, password, done) => {
        const { first_name, last_name, email } = req.body;
        try {
            const user = await userManager.getUser(username)
            if(user) {
                console.log(`Already a user un our DB with email ${username}`);
                return done(null, user);
            }

            const newUser = {
                first_name,
                last_name,
                email,
                social: 'local',
                age: '',
                password: createHash(password)
            }

            const result = await userManager.createUser(newUser); // Ver si se actualuza el rol dependiendo del email registrado

            if(result.email === 'adminCoder@coder.com' || result.email === 'm.christello@hotmail.com') {
                result.rol = 'admin';
                await result.save();
                return done(null, result);
            }

            await result.save();
            return done(null, result);
        } catch (error) {
            return done(`There's been an error when registering:`, error.message)
        }
    }));

    // Login con GitHub 
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.137989e66e9eb817',
        clientSecret: 'c81861470033eea4fb78afa6856b62da18edb425',
        callbackURL: 'http://localhost:8080/sessions/github-callback'
    },
    async(accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
            const user = await userManager.getUser(profile._json.email)
            if(user) {
                console.log(`Already exists a user with that email: `, user);
                return done(null, user);
            }

            const newUser = {
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email,
                social: 'GitHub',
                age: '',
                password: "",
                rol: (profile._json.email === 'adminCoder@coder.com' || 'm.christello@hotmail.com') ? 'admin' : 'user'
            }

            const result = await userManager.createUser(newUser);
            return done(null, result);

        } catch (error) {
            return done(`Ther's been an error authenticating with GitHub: `, error)
        }
    }));

    // Login con Google 
    passport.use('google', new GoogleStrategy({
        clientID: '254076352422-se3s5phvpsusol1ijpng3gj1d9efhn7s.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:8080/sessions/google-callback',
        passReqToCallback: true
    },
    async(request, accessToken, refreshToken, profile, done) => {
        console.log(`From Google: `, profile);
        try {
            const user = await userManager.getUser(profile._json.email);
            if(user) {
                console.log(`Already exists a user with email ${profile._json.email}`);
                return done(null, user);
            }

            const newUser = {
                first_name: profile._json.given_name,
                last_name: profile._json.family_name,
                email: profile._json.email,
                social: 'Google',
                age: '',
                password: "",
            }

            const result = await userManager.createUser(newUser);
            
            if(result.email === 'adminCoder@coder.com' || result.email === 'm.christello@hotmail.com') {
                result.rol = 'admin';
                await result.save();
                return done(null, result);
            }
            
            await result.save();
            return done(null, result);

        } catch (error) {
            return done(`Ther's been an error authenticating with Google: `, error)
        }
    }));

    // Login Local
    passport.use('local', new LocalStrategy({
        usernameField: 'email'
    }, 
    async(username, password, done) => {
        try {
            const user = await userManager.getUser(username);
            if(!user) {
                console.log(`Something's wrong, we culdn't find the user.`);
                return done(null, false)
            }

            if(!isValidPassword(user, password)) {
                return done(null, false);
            }

            const token = generateToken(user);
            user.token = token;

            return done(null, user)
        } catch (error) {
            return done(`Ups, something went wrong:`, error);
        }
    }))

    // JWT Passport Strategy
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.PRIVATE_KEY
    },
    async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    });
    
}


export default initializePassport;