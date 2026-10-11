import { Router } from "express";
import * as EventsController from "../controllers/events.controller.js";

// Importamos los middlewares exactos del archivo del profesor
import {auth}from "../middlewares/auth.js"; 

const router = Router();

// GET /api/events -> Públicos
router.get("/", auth("PUBLIC"), EventsController.list);
router.get("/:id", auth("PUBLIC"), EventsController.getById);


//=========Endopoints protegidos por roles y permisos========
// POST /api/events -> Protegido por roles
router.post("/", auth("admin", "organizer", "user"), EventsController.create);

// PUT y PATCH -> Requieren además verificar si es dueño o admin
router.put("/:id",auth("admin", "organizer"),EventsController.update);

router.patch("/:id/status",auth("admin", "organizer", "user"),EventsController.changeStatus);

export default router;
