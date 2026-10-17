import { TicketModel } from "./models/TicketModel.js";

export class TicketsDAO {
  // Crear un ticket nuevo
  async create(ticketData) {
    return await TicketModel.create(ticketData);
  }

  // Buscar un ticket específico por ID o filtro
  async getOne(filter) {
    return await TicketModel.findOne(filter);
  }

  // Traer los tickets de un usuario con los datos del evento cargados
  async getByUser(userId) {
    return await TicketModel.find({ user: userId })
      .populate("event")
      .lean();
  }

  // Contar cuántos tickets confirmados tiene un evento (para calcular cupos)
  async countConfirmedByEvent(eventId) {
    const tickets = await TicketModel.find({ event: eventId, status: "confirmed" });
    // Suma la cantidad total de asientos reservados
    return tickets.reduce((acc, ticket) => acc + ticket.quantity, 0);
  }

  // Cancelar un ticket
  async cancel(ticketId) {
    return await TicketModel.findByIdAndUpdate(
      ticketId,
      { status: "cancelled", cancelledAt: new Date() },
      { new: true }
    );
  }
}

export const ticketsDAO = new TicketsDAO();
