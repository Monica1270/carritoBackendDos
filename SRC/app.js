import express from 'express';
import productsRouter from './routes/productsRouter.js';
import { logger } from './middlewares/log.js';
import { config } from './config/config.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { Product } from './models/Product.models.js';
import { connectDB } from './config/db.config.js';
//import {handlebars} from 'express-handlebars';
import { engine } from 'express-handlebars';
import path from 'path';
import sessions from 'express-session';
import { router as sessionsRouter } from './routes/sessionsRouter.js';// Agrega esta línea arriba de todo en tu src/app.js:
import { fileURLToPath } from 'url';
import { dirname } from 'path'; // Agrega esta también si usas __dirname abajo



const app = express();
const port = config.general.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessions({
  secret: config.general.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);



app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'view/layout'),
  partialsDir: path.join(__dirname, 'view/partial'),
  helpers: {
    eq: (a, b) => a === b,
    multiply: (a, b) => (Number(a) || 0) * (Number(b) || 0)
  }
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'view'));

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send('<h1>Bienvenido al servidor Express 🔟</h1>');
});

// ===================== RUTA DE VISTA PARA HANDLEBARS =====================
app.get('/products', async (req, res, next) => {
  try {
const query = req.query.query ? String(req.query.query).trim() : '';
    let filter = {};

    if (query) {
      filter.$or = [
        { category: new RegExp(query, 'i') },
        { title: new RegExp(query, 'i') }
      ];
    }
 //Importante usar .lean() para que Handlebars pueda leer los datos sin restricciones
    const products = await Product.find(filter).lean();
    
    // Renderiza tu archivo src/view/home.handlebars
    res.render('home', { 
      title: 'Mi Tienda - Catálogo', 
      products 
    });
  } catch (error) {
    next(error);
  }
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