import { Router } from "express";
import { ticketsController } from "../controllers/tickets.controller.js";

const router = Router();

// Si tenés middleware de autenticación (ej: passport.authenticate('jwt', { session: false })),
// podés agregarlo antes de cada controller.
router.post("/", (req, res) => ticketsController.createTicket(req, res));
router.get("/my-tickets", (req, res) => ticketsController.getMyTickets(req, res));
router.delete("/:id", (req, res) => ticketsController.cancelTicket(req, res));

export default router;
