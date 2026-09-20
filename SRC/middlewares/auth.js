import { config } from "../config/config.js";

/* export const auth=(req, res, next) =>{
    if(req.query.user!="admin" || req.query.password!=config.general.SECRET){

        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Credenciales invalidas`})
    }
next()
} */
/**Esto lo llevamos a las rutas */
/**la session la debo reemplazar por JWT */
import jwt from 'jsonwebtoken';
export const auth=(req, res, next) =>{
    if(!req.headers.authorization){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`No existe usuarios autenticados`})
    }
    //bearer token
    let token = req.headers.authorization.split(" ")[1];

    try {
      let user = jwt.verify(token,config.general.JWT_SECRET); 
      req.user = user
    }catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Credenciales invalidas`})
      }
     next()
}