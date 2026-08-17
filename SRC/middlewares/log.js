export const logger=(req, res, next)=>{
    /**con el req me valida los datos que llega del cliente
     * se ejecuta antes que el handleware, o el  controler de una ruta
     */
    console.log(`Fecha:${new Date().toUTCString()} - url:${req.baseUrl} - method:${req.method}`)
    next()
}

/** este logger lo llevo a la app, router con import */
/** esta funcion hace que yo vea en la terminal lo que esta haciendo el cliente en el frontend y el metodo que usa
 * puede ser el get, put etc
 */