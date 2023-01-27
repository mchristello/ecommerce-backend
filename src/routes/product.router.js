import { Router } from 'express';
import { productManager } from '../dao/manager/index.js';

const router = new Router();

// GET - con pagination
router.get('/', async (req, res) => {
    try {
        const { page, limit, sort, query } = req.query;
        
        const variables = {
            page: page || 1,
            limit: limit || 10,
            sort: { price: sort || -1 },
            lean: true
        }
    
        const result = await productManager.getProducts(variables, query);
    
        res.send({
            status: 'Success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null,
        });
        
    } catch (error) {
        res.send({ Status: 'Failed', Message: error.message });
    }
})

// POST 
router.post('/', async (req, res) => {
    try {
        const result = await productManager.newProduct(req.body)
    
        res.send({ Status: 'Success', payload: result })
        
    } catch (error) {
        res.send({ Status: 'Failed', Message: error.message });
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
        res.send({ Status: 'Failed', Message: error.message });
    } 
})


// DELETE 
router.delete('/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
    
        const result = await productManager.deleteProduct(uuid);
    
        res.send({ Status: 'Success', payload: result });
        
    } catch (error) {
        res.send({ Status: 'Failed', Message: error.message });
    }
})


export default router;