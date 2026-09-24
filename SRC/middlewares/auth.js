import { config } from "../config/config.js";
import jwt from 'jsonwebtoken';

export const auth=(req, res, next) =>{
   const token = req.cookies?.currentUser 
    if (!token) {
      res.setHeader('Content-Type','application/json');
      return res.status(401).json({status:'error', message:'Credenciales invalidas'})
    }

    try {
      let user = jwt.verify(token,config.general.JWT_SECRET); 
      req.user = user
      next();
    }catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({status:'error', message:'Token invalido'})
      }
}