import { UserManager } from "./userManager.js";
import { CartManager } from './cartManager.js';
import { ProductManager } from "./productManager.js";


export const userManager = new UserManager();
export const cartManager = new CartManager();
export const productManager = new ProductManager();