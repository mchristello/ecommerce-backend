import passport from "passport";
import config from '../config/config.js';
import MyRouter from "./router.js";


export default class UserRouter extends MyRouter {

    init() {
        // REGISTER
        this.get('/register', async(req, res) => {
            res.render(`users/register`, {
                style: 'style.css'
            })
        });

        this.post('/register', passport.authenticate('register', { failureRedirect: '/users/error' }), async(req, res) => {
            res.redirect('/users/login');
        })

        this.get('/login', (req, res) => {
            res.render('users/login', {
                style: 'style.css'
            })
        })

        // LOGIN Local
        this.post('/login', passport.authenticate('local', { failureRedirect: '/users/error' }), (req, res) => {
            if (!req.user) {
                return res.status(400).render('errors/general', { 
                    style:'style.css',
                    error: `Invalid Credentials`
                })
            }

            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                rol: req.user.rol,
                social: req.user.social
            }

            res.cookie(config.COOKIE_NAME, req.user.token).redirect('/home');
        });

        // LOGIN GitHub
        this.get('/login-github', passport.authenticate('github', {scope: ['user: email']}), (req, res) => {
            // Ninguna lógica porque passport redirecciona a GitHub
        });

        this.get('/github-callback', passport.authenticate('github', { failureRedirect: '/users/error'}), (req, res) => {
            req.session.user = req.user;
            res.status(200).redirect('/users/account');
        });

        // LOGIN Google
        this.get('/login-google', passport.authenticate('google', {scope: ['email', 'profile']}), (req, res) => {
            // Ninguna lógica porque passport redirecciona a GitHub
        });

        this.get('/google-callback', passport.authenticate('google', { failureRedirect: '/users/error'}), (req, res) => {
            req.session.user = req.user;
            res.status(200).redirect('/users/account');
        })

        // LOGOUT
        this.get('/logout', async (req, res) => {
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).render('errors/general', { 
                        style: 'style.css',
                        error: err 
                    });
                }

                res.status(200).clearCookie(config.COOKIE_NAME).redirect('/home');
            });
        })

        // ERROR handling
        this.get('/error', async(req, res) => {
            return res.status(500).render('errors/general', { 
                style: 'style.css',
                error: 'Session Error, try again later' 
            });
        });

    }
}