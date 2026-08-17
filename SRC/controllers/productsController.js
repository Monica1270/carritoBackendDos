
/**Genero una clase */
/**me falta hacer la coneccion al handler */
export class ProductsController {
    /**Primero debo inicializar la instancia para luego acceder al get productos. La instancia la generamos
     * en el archivo inde.js
     */
    constructor(productsDao) {
        this.productsDao = productsDao;
    }/** todos los controladores tienen que tener su try y catch */

    getProducts = async (req, res) => {
        try{
        let productos = await this.productsDao.get();
        }catch(error){
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({ error:`Internal server error`});
        }
    }
    getProductById = async (req, res) => {
        try{
             let producto = `Producto con id ${req.params.id}`
        }catch(error){
          res.setHeader("Content-Type", "application/json");
        res.status(200).json({ message: "Producto por id", producto });
        return res.status(500).json({error:`Internal server error`})
    }
}  

        }
       
        
        