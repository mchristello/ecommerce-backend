import { Router } from 'express';
import passport from 'passport';
import { AuthMiddleware } from '../middlewares/index.js';


const router = Router();

// Render de Register View
router.get('/register', async(req, res) => {
    res.render(`sessions/register`, {
        style: 'style.css'
    })
})

// Route de registro con Passport
router.post(
    '/register', 
    passport.authenticate('register', '/sessions/registerFailed'), 
    async (req, res) => {

    return res.status(200).redirect('/sessions/account');

});

// Route de registro fallido
router.get(
    '/registerFailed', 
    async (req, res) => {

    console.error(`Failed to register`);
    return res.status(404).send({ 
        Success: 'Error', 
        error: `Failed to register`
    })
});

// Route de login con GitHub
router.get(
    '/login-github', 
    passport.authenticate('github', {scope: ['user: email']}), 
    async(req, res) => {
    // No hay ninguna lógica aqui dentro porque passport se encarga
});

router.get(
    '/github-callback', 
    passport.authenticate('github', {failureRedirect: '/login'}), 
    async(req, res) => {

    req.session.user = req.user;
    res.redirect('/sessions/account');

});

// Route de login con Google 
router.get(
    '/login-google', 
    passport.authenticate('google', { scope: ['email', 'profile']}),  
    async(req, res) => {
        // No hay lógica porque esta ruta solo redirecciona a google para login);
});

router.get(
    '/google-callback',
    passport.authenticate('google', { failureRedirect: '/login'}),
    async(req, res) => {
        req.session.user = req.user;
        res.redirect('/sessions/account');
});

// Route de login con Passport
router.get('/login', async(req, res) => {
    res.render('sessions/login', {
        style: 'style.css'
    });
})

router.post(
    '/login-local', 
    passport.authenticate('login', '/sessions/loginFailed'), 
    async (req, res) =>{
        if(!req.user) {
            return res.status(400).send({ 
                Success: 'Error', 
                error: `Invalid credentials` 
            });
        }
        
        req.session.user = req.user;

        return res.status(200).redirect('/products');
})

// Route de login fallido 
router.get('loginFailed', async (req, res) =>{
    console.error(`The login has failed, please try again.`)
    return res.status(404).send({ Status: 'Error', Message: `The login has failed` });
})

// Vista de el User Profile - No puede ingresar si no esta autenticado
router.get('/account', AuthMiddleware.isAuthenticated, async(req, res) => {
    const user = req.session.user

    res.render('sessions/account', {
        style: 'style.css',
        user,
        isAdmin: user.rol === 'admin',
    });
});

// Ruta privada
router.get('/private', AuthMiddleware.isAuthenticated, (req, res) => {
    res.json(req.session.user)
})

// Route de logout
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            return res.send({ Status: 'Error', Message: error.message });
        }
        else {
            return res.redirect('/products');
        }
    })
});

export default router;
