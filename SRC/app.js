import express from 'express';
import productsRouter from './routes/productsRouter.js';
import eventsRouter from './routes/events.router.js';
import { config } from './config/config.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { auth } from './middlewares/auth.js';
import { logger } from './middlewares/logger.js';
import { Product } from './models/Product.models.js';
import  user  from './models/user.js';
import { connectDB } from './config/db.config.js';
//import {handlebars} from 'express-handlebars';
import { hashPassword, validaHash } from './utils/hash.js';
import { engine } from 'express-handlebars';
import path from 'path';
import sessions from 'express-session';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import ticketsRouter from './routes/tickets.routes.js';
import { inicializarPassport } from './config/passport.config.js';
import {initPassport} from './config/passport.config.js';
import MongoStore from 'connect-mongo';
import { router as sessionsRouter } from './routes/sessionsRouter.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


//inicializacion de la app
const app = express();
const port = config.general.PORT;
//configuracion de  rutas relativas 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//conexion a la base de datos
connectDB();

//middlewares
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//manejo de sesiones con MongoDB
app.use(sessions({
  secret: config.general.SECRET,
  saveUninitialized: false,
  resave: false,
   store: MongoStore.create({
    mongoUrl: config.database.MONGO_URI,
    dbName: config.database.DB_NAME,
    ttl:3600,
  }),
}));

//2.segundo las sesiones se inicializan con passport
initPassport();
inicializarPassport();
app.use(passport.initialize());
app.use('/api/sessions', sessionsRouter);
app.get("/error", (req, res)=>{

    res.setHeader('Content-Type','application/json');
    return res.status(401).json({error:`Error al autenticar...!!!`})
})

app.get("/logout", (req, res)=>{

    res.clearCookie("cookietoken")
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Logout exitoso"});
})


app.use('/api/products', productsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/tickets', ticketsRouter);
//Motor de plantillas Handlebars
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


app.get(
    "/datos1", //Gestión de Ropa y Stock,ver ventas y reportes financieros,
    passport.authenticate("current", {session: false, failureRedirect: "/error"}), 
    auth("admin", "manager"), 
    (req, res)=>{

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"datos 1"});
    }
)

app.get(
    "/datos2", // ver catalogo, ver historial 
    passport.authenticate("current", {session: false, failureRedirect: "/error"}), 
    auth("user", "manager"), 
    (req, res)=>{

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"datos 2"});
    }
)

 app.get("/pruebas",
  logger,
  passport.authenticate("current", {session:false, failureRedirect:"/error"}),
  auth('user', 'admin', 'manager'),/*👈esto es tipo una funcion que viene desde el auth*/
 (req, res) => {
  console.log(req.headers);
  console.log(req.cookies);
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({payload:"Datos de prueba", user:req.user.first_name});
});
 
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
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

// 3. RUTA DE PERFIL (Protegida por tu middleware auth)
app.get('/usuario', auth, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    // Si en tu login guardaste el objeto plano, estará disponible en req.user
    const nombreUsuario = req.user.first_name || req.user.nombre || 'Usuario';
    
    res.status(200).json({
        mensaje: 'Perfil usuario ' + nombreUsuario,
        datos: req.user
    });
});

/** el error handler se debe colocar al final de las rutas 
 * de esta forma captura todos los errores de las rutas,
 * porque lee desde arriba hacia abafo
*/
app.use(errorHandler)

const server = app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
