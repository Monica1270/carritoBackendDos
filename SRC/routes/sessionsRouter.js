import { Router } from "express";
import { login,logout,register,current} from "../controllers/sessionsController.js";
import {auth} from "../middlewares/auth.js";
export const router = Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.get('/current',auth,current)

export default router


