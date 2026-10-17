import { connectDB } from './SRC/config/db.config.js';
import { EventModel } from './SRC/models/event.model.js';
import mongoose from 'mongoose';

const createPublishedEvent = async () => {
  try {
    // 1. Conectar a la base
    await connectDB();

    // 2. Crear el documento publicado con todos los campos requeridos por tu EventSchema
    const newEvent = await EventModel.create({
      title: "Retiro de Pedido - Producto Test",
      description: "Reserva de turno para retiro en local comercial",
      category: new mongoose.Types.ObjectId(), // Categoría simulada
      date: new Date("2026-12-01"),            // Fecha futura
      location: "Local Comercial Centro",
      capacity: 10,                            // Cupo / stock disponible
      price: 1500,
      status: "published",                     // Requisito clave para la reserva
      organizer: new mongoose.Types.ObjectId("6ab4618585b3c47473975893"), // Tu userId
      deliveryMethod: "Retiro del local",
      deliveryDate: new Date("2026-12-01"),
      costoEnvio: 0
    });

    console.log("✅ Evento publicado creado exitosamente:");
    console.log("ID del evento:", newEvent._id.toString());
  } catch (error) {
    console.error("❌ Error al crear el evento:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createPublishedEvent();
