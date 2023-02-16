import { productManager } from "../dao/managers/index.js";
import MyRouter from "./router.js";


export default class ProductRouter extends MyRouter {

    init() {
        // GET - Pagination
        this.get('/', async (req, res) => {
            try {
                const { page, limit, sort, query } = req.query;

                const variables = {
                    page: page || 1, 
                    limit: limit || 10,
                    sort: { price: sort || -1 },
                    lean: true
                };

                const result = await productManager.getProducts(variables, query);

                res.send({
                    status: 'success',
                    payload: result.docs,
                    totalPages: result.totalPages,
                    prevPage: result.prevPage,
                    nextPage: result.nextPage,
                    page: result.page,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
                    nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
                });

            } catch (error) {
                res.sendServerError(error)
            }
        });

        // POST
        this.post('/', async (req, res) => {
            try {
                const newProduct = req.body

                const result = await productManager.newProduct(newProduct);

                res.sendSuccess({ result });
            } catch (error) {
                res.sendServerError({ error: error.message });
            }
        })

        // PUT
        this.put('/:pid', async (req, res) => {
            try {
                const pid = req.params.pid;

                const changes = req.body

                const result = await productManager.updateProduct(pid, changes);

                const newProduct = await productManager.findProducts(pid)

                return res.sendSuccess({ newProduct })

            } catch (error) {
                res.sendServerError({ error: error.message });
            }
        })

        // DELETE
        this.delete('/:pid', async(req, res) => {
            try {
                const pid = req.params;

                const deleteProduct = await productManager.deleteProduct(pid);

                const allProducts = await productManager.getProducts();

                return res.sendSuccess({ allProducts });

            } catch (error) {
                return res.sendServerError({ error: error.message });
            }
        })
    }
}