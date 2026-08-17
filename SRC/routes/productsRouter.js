/**de la librería express le digo tomate el componente router */
import { Router } from "express";
/**y lo inicializo aca */
import { productsController } from "./index.js";
import { logger } from "../middlewares/log.js";
import { auth } from "../middlewares/auth.js";
export const productsRouter = Router();


productsRouter.use(logger)
productsRouter.use(auth)

/**voy generando las rutas */
productsRouter.get("/", productsController.getProducts)


productsRouter.get("/:id", productsController.getProductById)

productsRouter.get('/informe1/',(req,res)=>{

    let producto=`Producto ${req.params.id}`

    res.setHeader('Content-Type','application/json')
    res.status(200).json({producto})
})

productsRouter.post("/", (req, res) => {
    let newProduct = "nuevo producto"   
    res.setHeader("Content-Type", "application/json");      
    res.status(200).json({ newProduct });
})

productsRouter.put("/:id", (req, res) => {
    let updateProduct = "producto actualizado"   
    res.setHeader("Content-Type", "application/json");      
    res.status(200).json({ updateProduct });
})

productsRouter.delete("/:id", (req, res) => {
    let deletedProduct = "producto eliminado"   
    res.setHeader("Content-Type", "application/json");      
    res.status(200).json({ deletedProduct });
})
