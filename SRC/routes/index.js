import {Router} from 'express';
import {ProductsController}  from '../controllers/productsController.js';
import {ProductsDao} from '../dao/productsDaos.js';


const router = Router();
const productsDao = new ProductsDao();
export const productsController = new ProductsController(productsDao)




 


