import { config } from "../config/config.js";
import jwt from 'jsonwebtoken';

//los permisos se pasan como parametros a la funcion auth, y se comparan con los permisos del usuario que se obtiene del token
export const auth=(...permisos) =>{
  return (req,res,next)=>{
    //1 Normalizar permisos pasados por la ruta a mayusculas
       permisos=permisos.map(p=>p.toUpperCase())
      
      //2.REGLA DE ORO: Si es PUBLIC, pasa directo sin pedir token ni evaluar nada más
      if(permisos.includes("PUBLIC")){
        return next() 
      }
      //3 obtener el token de las cookie
   const token = req.cookies?.currentUser 
    if (!token) {
      res.setHeader('Content-Type','application/json');
      return res.status(401).json({status:'error', message:'Credenciales invalidas'})
    }
//4 verificar el token y extraer usuario(autenticacion)
    try {
      let user = jwt.verify(token,config.general.JWT_SECRET); 
      req.user = user
       
    }catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({status:'error', message:'Token invalido'})
      }
//5 Validar si el usuario tiene permisos para acceder a la ruta (autorizacion)
      if(!req.user || !req.user.role ){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:'Error de autenticación'})
      }         
        
        if(!permisos.includes(req.user.role.toUpperCase())){
          res.setHeader('Content-Type','application/json');
          return res.status(403).json({error:'No tienes permisos para acceder a este recurso'})
        }
     //si todo esta bien, se llama a next para continuar con la ruta
     next()
    }
 
  }

   