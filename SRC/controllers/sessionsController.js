//import { UsersDAO} from "../dao/UsersDAO.js";
//import { hashPassword, validaHash } from "../utils/hash.js";
import { UsersDTO } from "../dto/usersDto.js";
//import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

//Instanciamos la clase Dao
//const usersDao = new UsersDAO

// configuracion de las cookes de autenticacion
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.general.NODE_ENV === 'production', // Cambiar a true si se utiliza HTTPS
  sameSite: 'lax',
  maxAge: 3600000 // 1 hora en milisegundos
};
// ========= Register (delegado en Passport) =========

export const register = async (req, res) => {
  try {
    if (!req.user) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ status: "error", message: "No se pudo registrar el usuario" });
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(201).json({
      status: "success",
      message: `Registro exitoso para ${req.user.first_name}`,
      newUser: new UsersDTO(req.user)
    });
  } catch (error) {
    console.error(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ status: "error", message: "internal server error" });
  }
};

//=========Login=======

export const login = async (req, res) => {

   try { 
       const user=req.user
if (!user) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ status: 'error', message: 'Usuario no autenticado' });
    }


//armando el payload para el token
  const payload = {
      id: user._id,
      email: user.email,
      role: user.role || 'user'
    }; 

    const token = jwt.sign(payload, config.general.JWT_SECRET, { expiresIn: '1h' });


    res.cookie('currentUser', token, COOKIE_OPTIONS);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json
    ({status:"success",
      message:"Login exitoso",
      user: new UsersDTO(user)
    });
    
  } catch (error) {
    console.error(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ status: 'error', message: 'internal server error' });
  }
};
    

//=========Logout=======
export const logout = async (req, res) => {
try {
    res.clearCookie('currentUser', COOKIE_OPTIONS);
return res.status(200).json({ status: 'success', message: 'Logout exitoso' });
  } catch (error) {
    console.error(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ status: "error", message: "internal server error" });
  }
  
  };
  //===========Current==========
export const current =(req, res) => {
  res.setHeader('Content-Type','application/json');
  return res.status(200).json({ 
    status:'success',
    payload:{
      id: req.user.id || req.user._id,
      email: req.user.email,
      role: req.user.role || 'user'
    }
  });
}
