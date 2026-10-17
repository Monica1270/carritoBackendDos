import { ticketsService } from "../services/tickets.service.js";

export class TicketsController {
  // POST /api/tickets - Crear reserva
  async createTicket(req, res) {
    try {
      const userId = req.user?._id || req.body.userId; // Soporta req.user (si usás Passport) o req.body
      const eventId= req.params.eventId || req.body.eventId;
      const {quantity} = req.body;

      if (!userId || !eventId) {
        return res.status(400).json({ status: "error", message: "Faltan datos obligatorios (userId, eventId)." });
      }

      const ticket = await ticketsService.createTicket(userId, eventId, Number(quantity) || 1);
      return res.status(201).json({ status: "success", payload: ticket });
    } catch (error) {
      return res.status(400).json({ status: "error", message: error.message });
    }
  }

  // GET /api/tickets/my-tickets - Listar reservas del usuario
  async getMyTickets(req, res) {
    try {
      const userId = req.user?._id || req.query.userId;
      if (!userId) {
        return res.status(401).json({ status: "error", message: "Usuario no identificado." });
      }

      const tickets = await ticketsService.getUserTickets(userId);
      return res.status(200).json({ status: "success", payload: tickets });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  }
  // GET /api/events/:eid/tickets - Listar inscriptos de un evento (organizador o admin)
  async getEventTickets(req, res) {
    try {
      const { eid } = req.params;
      const tickets = await ticketsService.getEventTickets(eid, req.user);
      return res.status(200).json({ status: "success", payload: tickets });
    } catch (error) {
      return res.status(403).json({ status: "error", message: error.message });
    }
  }



  // DELETE /api/tickets/:id - Cancelar reserva
  async cancelTicket(req, res) {
    try {
      const userId = req.user?._id || req.body.userId;
      const { id } = req.params;
      const userRole = req.user?.role // Obtener el rol del usuario desde req.user o req.body
      const cancelledTicket = await ticketsService.cancelTicket(id, userId);
      return res.status(200).json({ status: "success", payload: cancelledTicket });
    } catch (error) {
      return res.status(400).json({ status: "error", message: error.message });
    }
  }
}

export const ticketsController = new TicketsController();
