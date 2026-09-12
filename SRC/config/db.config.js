import mongoose from 'mongoose';
import {config} from './config.js';

const MONGODB_URI = config.database.MONGO_URI;
export const connectDB = async () => {
if (!MONGODB_URI) {
  console.error('❌ ERROR CRÍTICO: No se encontró la variable de entorno MONGO_URI o MONGODB_URI');
  return;
}
/**
 * Función asíncrona para iniciar la conexión con la base de datos
 */
/* export const connectDB = async () => { */
  try {
    // Conectamos usando la URI configurada en variables de entorno.
    // Aunque Mongoose v8 ya habilita de forma predeterminada el nuevo analizador y motor de topología,
    // pasamos las opciones de compatibilidad solicitadas por el temario de la academia.
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error('❌ Falló la conexión inicial a la base de datos:', error.message);
  }
};

const db = mongoose.connection;

// Ocultamos la contraseña para no mostrarla en consola
const maskedURI = MONGODB_URI.replace(/:([^@]+)@/, ':****@');

// Manejadores de Eventos del Ciclo de Vida de la Conexión (Requerimiento del temario)
db.on('connected', () => {
  //console.log(`🟢 Mongoose: Conectado con éxito a MongoDB en: ${maskedURI}`);
});

db.on('error', (err) => {
  //console.error('❌ Mongoose: Ocurrió un error en la conexión:', err.message);
});

db.on('disconnected', () => {
  //console.log('⚠️ Mongoose: Conexión con la base de datos finalizada/desconectada.');
});