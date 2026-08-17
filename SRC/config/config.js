
/** con este👇proceso hago que se cargue la varialbe de entorno que tengo en el archivo .env*/
process.loadEnvFile("./.env")
/** Se crea un objeto se crea propiedades por cada una de las variables de entorno
 */
export const config = {
    /** estos process se conencta con el sistema operativo de node
     * si nosotros ejecutamos node server.js . Esto valida que este bien el codigo
     * lo tengo que importar a app.js, 
     */
    general:{
          PORT: process.env.PORT,
    SECRET:process.env.SECRET,
    },
  database:{
    MONGO_URL:process.env.MONGO_URL
  },
    
}
console.log(config)