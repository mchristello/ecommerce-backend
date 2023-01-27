import { UserManager } from './user.manager.js';
import { ProductManager } from './product.manager.js';
import { CartManager } from './cart.manger.js';

export const userManager = new UserManager();
export const productManager = new ProductManager();
export const cartManager = new CartManager();