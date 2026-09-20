import express from 'express';
import productsRouter from './routes/productsRouter.js';
import { config } from './config/config.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { auth } from './middlewares/auth.js';
import { Product } from './models/Product.models.js';
import  user  from './models/user.js';
import { connectDB } from './config/db.config.js';
//import {handlebars} from 'express-handlebars';
import { hashPassword, validaHash } from './utils/hash.js';
import { engine } from 'express-handlebars';
import path from 'path';
import sessions from 'express-session';
import jwt from 'jsonwebtoken';
import MongoStore from 'connect-mongo';
import { router as sessionsRouter } from './routes/sessionsRouter.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';



const app = express();
const port = config.general.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
// ===================== RUTAS DE AUTENTICACIÓN ADAPTADAS A MONGOOSE =====================

// 1. RUTA DE REGISTRO (Corregida con async/await y hashPassword)
app.post('/registro', async (req, res, next) => {
    try {
        let { nombre, email, password } = req.body;
        if (!nombre || !email || !password) return res.status(400).send('Ingrese todos los datos');

        // Buscar en Mongoose usando el modelo 'user' en minúscula
        let usuarioExistente = await user.findOne({ email });
        if (usuarioExistente) return res.status(400).send(`El usuario ${email} ya existe`);

        // Encriptamos la contraseña con tu utilería hash.js
        const hashedPassword = hashPassword(password);

        // Creamos el documento en Atlas
        let usuarioCreado = await user.create({
            first_name: nombre, // Asegúrate de que coincida con tu Schema (first_name o nombre)
            email, 
            password: hashedPassword
        });

        // Convertimos a objeto plano y removemos la contraseña por seguridad
        let respuestaUsuario = usuarioCreado.toObject();
        delete respuestaUsuario.password;

        res.status(201).json({
            usuarioCreado: respuestaUsuario
        });
    } catch (error) {
        next(error);
    }
});
  
// 2. RUTA DE LOGIN (Corregida con validaHash y config.general.SECRET)
app.post('/login', async (req, res, next) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) return res.status(400).send('Ingrese email y password');

        // Buscamos al usuario únicamente por su email usando 'user'
        let usuario = await user.findOne({ email });
        if (!usuario) return res.status(400).send(`Error credenciales`);

        // Validamos la contraseña usando tu función síncrona validaHash
        const isMatch = validaHash(password, usuario.password);
        if (!isMatch) return res.status(400).send(`Error credenciales`);

        // Ocultamos la contraseña del payload del JWT
        let usuarioPlano = usuario.toObject();
        delete usuarioPlano.password;

        // Firmamos el token con la clave real de tu .env
        let token = jwt.sign(usuarioPlano, config.general.SECRET, { expiresIn: "1h" });

        return res.status(200).json({
            usuarioLogueado: usuarioPlano,
            token
        });
    } catch (error) {
        next(error);
    }
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