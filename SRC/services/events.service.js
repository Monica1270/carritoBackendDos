import mongoose from "mongoose";
import { EventModel } from "../models/event.model.js";

// Clase auxiliar de error para simular el HttpError de tu profesor sin que rompa tu servidor
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const ALLOWED_STATUS = ["draft", "published", "cancelled", "finished"];
const ALLOWED_SORT = ["date", "-date", "title", "-title", "price", "-price", "createdAt", "-createdAt"];

class EventsService {
  
  // Validaciones internas del profesor
  assertOwnerOrAdmin(event, actor) {
    const organizerId = event.organizer._id ? event.organizer._id.toString() : event.organizer.toString();
    const isAdmin = actor.role === "admin";
    const isOwner = organizerId === actor._id.toString();
    if (!isAdmin && !isOwner) {
      throw new HttpError(403, "No tenés permisos para modificar este evento");
    }
  }

  assertEditable(event) {
    if (event.status === "cancelled") throw new HttpError(400, "Un evento cancelado no puede modificarse");
    if (event.status === "finished") throw new HttpError(400, "Un evento finalizado no puede modificarse");
  }

  parseFutureDate(value) {
    const eventDate = new Date(value);
    if (isNaN(eventDate.getTime())) throw new HttpError(400, "La fecha del evento no es válida");
    if (eventDate <= new Date()) throw new HttpError(400, "La fecha del evento debe ser futura");
    return eventDate;
  }

  parseCapacity(value) {
    const capacity = Number(value);
    if (!Number.isFinite(capacity) || capacity <= 0) throw new HttpError(400, "La capacidad debe ser mayor a cero");
    return capacity;
  }

  parsePrice(value) {
    const price = Number(value);
    if (!Number.isFinite(price) || price < 0) throw new HttpError(400, "El precio no puede ser negativo");
    return price;
  }

  // 1. LISTAR EVENTOS (Adaptado con tu nombre 'getAllEvents' pero usando el filtro y Promise.all del profesor)
  async getAllEvents(query = {}) {
    const { status, category, location, dateFrom, dateTo, search, page = 1, limit = 10, sort = "date" } = query;

    let filter = {}; // Corregido el bug del profesor

    if (status) {
      if (!ALLOWED_STATUS.includes(status)) throw new HttpError(400, "status inválido");
      filter.status = status;
    } else {
      filter.status = "published";
    }

    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: "i" };

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const skip = (pageNumber - 1) * limitNumber;
    const sortOption = ALLOWED_SORT.includes(sort) ? sort : "date";

    const [data, total] = await Promise.all([
      EventModel.find(filter)
        .populate("organizer", "first_name last_name email role")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      EventModel.countDocuments(filter),
    ]);

    return {
      data,
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber) || 0,
    };
  }

  // 2. OBTENER POR ID
  async getEventById(id) {
    if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Id de evento inválido");
    const event = await EventModel.findById(id).populate("organizer", "first_name last_name email role").lean();
    if (!event) throw new HttpError(404, "Evento no encontrado");
    return event;
  }

  // 3. CREAR EVENTO (Integrado con costo de envío automatizado de $20.000)
  async createEvent(payload, organizerId) {
    const { title, description, category, date, location, capacity, price, deliveryMethod, deliveryDate } = payload;

    if (!title || !description || !category || !date || !location || capacity === undefined || !deliveryMethod || !deliveryDate) {
      throw new HttpError(400, "Todos los campos mínimos y de logística son obligatorios");
    }

    let calculadoCosto = 0;
    if (deliveryMethod === 'Envío a domicilio') {
      calculadoCosto = 20000;
    }

    return await EventModel.create({
      title,
      description,
      category,
      date: this.parseFutureDate(date),
      location,
      capacity: this.parseCapacity(capacity),
      price: this.parsePrice(price ?? 0),
      organizer: organizerId,
      status: "draft",
      deliveryMethod,
      deliveryDate: new Date(deliveryDate),
      costoEnvio: calculadoCosto
    });
  }

  // 4. MODIFICAR EVENTO (PUT)
  async updateEvent(id, payload, actor) {
    const event = await EventModel.findById(id);
    if (!event) throw new HttpError(404, "Evento no encontrado");

    this.assertOwnerOrAdmin(event, actor);
    this.assertEditable(event);

    if (payload.title !== undefined) event.title = payload.title;
    if (payload.description !== undefined) event.description = payload.description;
    if (payload.category !== undefined) event.category = payload.category;
    if (payload.location !== undefined) event.location = payload.location;
    if (payload.date !== undefined) event.date = this.parseFutureDate(payload.date);
    if (payload.capacity !== undefined) event.capacity = this.parseCapacity(payload.capacity);
    if (payload.price !== undefined) event.price = this.parsePrice(payload.price);
    if (payload.deliveryMethod !== undefined) event.deliveryMethod = payload.deliveryMethod;
    if (payload.deliveryDate !== undefined) event.deliveryDate = new Date(payload.deliveryDate);

    if (event.deliveryMethod === 'Envío a domicilio') {
      event.costoEnvio = 20000;
    } else {
      event.costoEnvio = 0;
    }

    await event.save();
    return event.toObject();
  }

  // 5. CAMBIAR ESTADO (PATCH)
  async updateEventStatus(id, status, actor) {
    if (!ALLOWED_STATUS.includes(status)) throw new HttpError(400, "status inválido");
    const event = await EventModel.findById(id);
    if (!event) throw new HttpError(404, "Evento no encontrado");

    this.assertOwnerOrAdmin(event, actor);

    if (event.status === "cancelled" && status !== "cancelled") {
      throw new HttpError(400, "Un evento cancelado no puede cambiar de estado");
    }
    if (event.status === "finished") {
      throw new HttpError(400, "Un evento finalizado no puede cambiar de estado");
    }

    if (status === "published") {
      if (event.status === "cancelled" || event.status === "finished") {
        throw new HttpError(400, "No se puede publicar un evento cancelado o finalizado");
      }
      if (new Date(event.date) <= new Date()) {
        throw new HttpError(400, "No se puede publicar un evento con fecha pasada");
      }
    }

    event.status = status;
    await event.save();
    return event.toObject();
  }
    // 6. ELIMINAR EVENTO (DELETE)
  async deleteEvent(id, actor) {
    if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Id de evento inválido");
    
    const event = await EventModel.findById(id);
    if (!event) throw new HttpError(404, "Evento no encontrado");

    this.assertOwnerOrAdmin(event, actor);

    await EventModel.findByIdAndDelete(id);
    return { message: "Evento eliminado exitosamente", id };
  }

}

export const eventsService = new EventsService();
