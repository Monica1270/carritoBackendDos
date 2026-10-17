import crypto from "crypto";
import { ticketsDAO } from "../dao/TicketsDao.js";
// Ajustá la ruta o importación según cómo obtengas los eventos (EventsDAO o EventModel):
import { EventModel } from "../models/event.model.js";
import { userModel } from "../models/usersModel.js";
import { sendEmail } from "../utils/mailer.js";


export class TicketsService {
  // Crear una nueva reserva con control de cupos/stock
  async createTicket(userId, eventId, quantity = 1) {
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error("La cantidad debe ser un número mayor a cero.");
    }
    // 1. Validar existencia del evento 
    const event = await EventModel.findById(eventId);
    if (!event) {
      throw new Error("El evento o producto no existe.");
    }
    //////2validar estado publicado
    if (event.status !== "published") {
      throw new Error("No es posible inscribirse a un evento que no esté publicado.");
    }
    //3 validar que la fecha del evento no haya pasado
    if (new Date(event.date) <= new Date()) {
      throw new Error("El período de retiro ya finalizó.");
    }
    // 4. Evitar reservas duplicadas para el mismo usuario 
    const existingTicket = await ticketsDAO.getOne({
      user: userId,
      event: eventId,
      status: { $ne: "cancelled" }
    });

    if (existingTicket) {
      throw new Error("Ya tenés un día reservado para el retiro del local.");
    }

    // 3. Control de cupos disponibles
    const totalReserved = await ticketsDAO.countConfirmedByEvent(eventId);
    const availableSeats = event.capacity - totalReserved;
    if (quantity > availableSeats) {

      throw new Error('No hay días disponibles para el retiro en el local.');
    }



    // 4. Generar código único de reserva y crear el ticket
    const reservationCode = crypto.randomUUID().slice(0, 8).toUpperCase();

    const newTicket = await ticketsDAO.create({
      user: userId,
      event: eventId,
      quantity: quantity,
      reservationCode,
      status: "confirmed"
    });

    try {
      // Enviar correo de confirmación al usuario
      const user = await userModel.findById(userId);
      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: "Confirmación de reserva",
          text: `Hola ${user.first_name || ""}! Tu inscripción al evento "${event.title}" fue confirmada con el código: ${reservationCode}. ${reservationCode}`,
        });
      }
      // Lógica para enviar correo
    } catch (error) {
      console.error("Error al enviar correo de confirmación:", error);
    }

    return newTicket;
  }

  // Obtener tickets de un usuario
  async getUserTickets(userId) {
    return await ticketsDAO.getByUser(userId);
  }

  // Cancelar ticket
  async cancelTicket(ticketId, userId,userRole) {
    const ticket = await ticketsDAO.getOne({ _id: ticketId });
    if (!ticket) {
      throw new Error("El ticket no existe.");
    }

    /* Asegurar que el usuario sea el dueño del ticket
    if (ticket.user.toString() !== userId.toString()) {
      throw new Error("No tenés permiso para cancelar este ticket.");
    }*/
    const isOwner = ticket.user.toString() === userId.toString();
    const isAdmin = userRole === "admin";
    if (!isOwner && !isAdmin) {
      throw new Error("No tenés permiso para cancelar este ticket.");
    }

    if (ticket.status === "cancelled") {
      throw new Error("El ticket ya se encuentra cancelado.");
    }

    return await ticketsDAO.cancel(ticketId, {
      status: "cancelled",
      cancelledAt: new Date()
    });
  }
  // 4. Obtener tickets de un evento (organizador o admin)
  async getEventTickets(eventId, actor) {
    const event = await EventModel.findById(eventId);
    if (!event) {
      throw new Error("El evento no existe.");
    }
    const organizerId = event.organizer._id ? event.organizer._id.toString() : event.organizer.toString();
    const isOwner = organizerId === (actor._id || actor.id).toString();
    const isAdmin = actor.role === "admin";
    if (!isOwner && !isAdmin) {
      throw new Error("No tenés permisos para ver los tickets de este evento.");
    }
    return await ticketsDAO.getByEvent(eventId);
  }
}

export const ticketsService = new TicketsService();
