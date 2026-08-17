
import {ProductsController}  from '../controllers/productsController.js';
import {ProductsDao} from '../dao/producsDaos.js';





const productsDao = new ProductsDao();
export const productsController = new ProductsController(productsDao)
