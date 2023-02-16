import MyRouter from './router.js';
import { cartManager, productManager } from '../dao/managers/index.js';
import { MissingInputsError } from '../utils/error.utils.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';

export default class ViewsRouter extends MyRouter {

    init() {

        // GET to homepage
        this.get('/home', async(req, res) => {
            const user = req.session.user;
            if(!user) return res.status(200).render('index', { style: 'style.css'})

            res.status(200).render('index', { style: 'style.css', user });
        })
        // GET w/paginate & query params
        this.get('/products', async(req, res) => {
            try {
                const { page, limit } = req.query;
                const query = req.query?.query || req.body?.query || "";
                const sort = req.query?.sort || req.body?.sort || "";

                const options = {
                    page: page || 1,
                    limit: limit || 10,
                    sort: { price: sort || -1 },
                    lean: true
                }

                const result = await productManager.getProducts(options, query)

                result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${result.limit}&query=${query || ""}&sort=${sort}` : "";
                result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}&limit=${result.limit}&query=${query || ""}&sort=${sort}` : ""; 
                
                result.isValid = !(page <= 0 || page > result.totalPages);

                const user = req.session.user;

                res.render('products/products', {
                    style: 'style.css',
                    result,
                    user,
                    query: query
                });

            } catch (error) {
                res.status(500).render('errors/general', {
                    style: 'style.css',
                    error: error.message
                })
            }
        });

        // GET to Carts
        this.get('/carts/:cid', AuthMiddleware.isAuthenticated, async(req, res) => {
            try {
                const cid = req.params.cid;

                if(!cid) {
                    throw new MissingInputsError(`Please complete all the required inputs.`)
                }

                const result = await cartManager.getCartById(cid);

                const user = req.session.user;

                res.render('products/carts', { 
                    result,
                    user,
                    style: 'style.css'
                })
            } catch (error) {
                res.status(500).render('errors/general', {
                    style: 'style.css',
                    error: error.message
                })
            }
        });

        // GET to add new product
        this.get('/products/addNew', AuthMiddleware.isAuthenticated, async (req, res) => {
            const user = req.session.user;

            res.render('products/addNew', {
                style: 'style.css',
                user,
                isAdmin: user.rol === 'admin'
            });
        });

        // POST to add new product
        this.post('/products/addNew', AuthMiddleware.isAuthenticated, async(req, res) => {
            try {
                const body = req.body;
    
                if(!body) {
                    throw new MissingInputsError(`Please, check if all required fields are completely filled.`)
                }
                const newProduct = await productManager.newProduct(body);
                
                res.redirect('products');

                return newProduct;
    
            } catch (error) {
                res.sendServerError(error)
            }
        });
        
        // GET to product detail 
        this.get('/products/:pid', async (req, res) => {
            const pid = req.params.pid;
            if(!pid) {
                throw new MissingInputsError(`Please, provide a Product ID.`)
            }

            const productFound = await productManager.findProducts(pid);

            const user = req.session.user;

            res.render('products/productDetail', {
                style: 'style.css',
                user,
                productFound
            })
        });

        // User Profile
        this.get('/users/account', AuthMiddleware.isAuthenticated, async(req, res) => {
            try {
                const user = req.session.user
            
                res.render('users/account', {
                    style: 'style.css',
                    user,
                    isAdmin: user.rol === 'admin',
                });
            } catch (error) {
                return res.sendAuthenticationError(error);
            }
        })

    }
}