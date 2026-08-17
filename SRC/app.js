import express from 'express';
import { productsRouter } from './routes/productsRouter.js';
import { logger } from './middlewares/log.js';
import { config } from './config/config.js';
import { errorHandler } from './middlewares/errorHandler.js';



const app = express();
const port = config.general.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productsRouter);


app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send('<h1>Bienvenido al servidor Express 🔟</h1>');
});
app.get('/test', (req, res) => {
   if(req.query.error){
        throw new Error("Error de pruebas...!!!")}

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send({ message: 'Test OK' });
});


/** el error handler se debe colocar al final de las rutas 
 * de esta forma captura todos los errores de las rutas,
 * porque lee desde arriba hacia abafo
*/
app.use(errorHandler)

const server = app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});