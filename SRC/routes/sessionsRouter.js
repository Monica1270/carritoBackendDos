import { Router } from "express";
import { login,logout,register,current} from "../controllers/sessionsController.js";
//import {auth} from "../middlewares/auth.js";
import passport from "passport";


export const router = Router()
//=======Registro delegado en la estrategia""register", de Passport====
router.post('/register',  passport.authenticate("register", { session: false, failureRedirect: "/error" }),
  register);
//======Login autenticado con la estrategia "login" de Passport
router.post('/login',
    passport.authenticate("login",{session:false, failureRedirect:"/error"}),
        login);

//=======Endpoint current protegido con la estrategia JWT "current" de Passport
router.get('/current', passport.authenticate("current",{session:false}),current);

//========Logout
router.post('/logout',logout);

export default router


