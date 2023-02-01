import { Router } from 'express';
import { productManager, cartManager } from '../dao/manager/index.js';
import { ProductModel } from '../dao/models/Product.js';

const router = new Router();

// GET with query params
router.get('/products', async (req, res) => {
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
    
        const result = await productManager.getProducts(options, query);
    
        result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${result.limit}&query=${query || '' }&sort=${sort || -1}`: "";
        result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}&limit=${result.limit}&query=${query || '' }&sort=${sort || -1}`: "";
        
        result.isValid = !(page <= 0 || page>result.totalPages);
        
        const user = req.session.user;

        res.render('products/index', {
            style: 'style.css',
            result,
            user,
            query: query
        });

    } catch (error) {
        res.send({ Status: 'Failed in views.router', Message: error.message })
    }
});

// GET to create a new product
router.get('/products/addNew', async (req, res) => {
    const user = req.session.user
    
    res.render('products/addNew', {
        style:'style.css',
        user,
        isAdmin: user.rol === 'admin',
    });
});

// GET to sessions views
router.get('/sessions/register', async (req, res) => {
    res.render(`sessions/register.hbs`, {
        style: 'style.css'
    })
})

// POST to create new product
router.post('/products/addNew', async (req, res) => {
    try {
        const newProduct = req.body;
    
        const productAdded = await ProductModel(newProduct);
        await productAdded.save()
            
        res.redirect('products');
        
    } catch (error) {
        res.send({ Status: 'Failed', Message: error.message })
    }
})

// GET to product detail
router.get('/products/:pid', async (req, res)=>{
    try {
        const pid = req.params.pid;
        const productFound = await productManager.findProducts(pid);

        const user = req.session.user
        
        res.render('products/productDetail', {
            productFound,
            user,
            style:'style.css'
        })
        
    } catch (error) {
        res.send({ Status: 'Failed', Message: error.message })
    }
})

// PUT 
router.put('/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params; // captura el id de la url en la const        
        const productToReplace = req.body // captura los tados del nuevo producto
        
        const result = await productManager.updateProduct(uuid, productToReplace);    
        res.send({ Status: 'Success', payload: result });
        
    } catch (error) {
        res.send({ Status: 'Failed', Message: error.message })
    }
})

// DELETE 
router.delete('/delete/:pid', async (req, res) => {
    try {
        const pid = new mongoose.Types.ObjectId(req.params)
        
        const product = await productManager.deleteProduct(pid);
        console.log(product);
        
        // res.render('index', {
        //     style:'style.css',
        //     product
        // })
        
        res.redirect('/products')
    } catch (error) {
        res.send({ Status: 'Failed', Message: error.message })
    }
})

// Get to Carts
router.get('/carts', async (req, res) => {
    try {
        const allCarts = await cartManager.getCarts();
    
        const user = req.session.user;
    
        res.render('products/carts', {
            style:'style.css',
            allCarts,
            user,
        })
        
    } catch (error) {
        res.send({ Status: 'Failed', Message: error.message })
    }
})

router.get('/carts/:cid', async(req, res) => {
    try {
        const cid = req.params.cid
    
        const result = await cartManager.getCartById(cid);
        console.log(JSON.stringify(result, null, 2, `\t`));
        const user = req.session.user;
    
        res.render('products/carts', {
            style: 'style.css',
            result,
            user,
        })
        
    } catch (error) {
        res.send({ Status: 'Failed', Message: error.message })
    }
})



export default router;