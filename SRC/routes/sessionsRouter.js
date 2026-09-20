import { Router } from "express";
import { login,logout,register } from "../controllers/sessionsController.js";
export const router = Router()

router.post('/register',register)
router.post('/login',login)
router.get('/logout',logout)

