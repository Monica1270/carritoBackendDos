import { Router } from "express";
import { register } from "../controllers/sessionsController.js";


export const router = Router()
router.post('/register',register)

 