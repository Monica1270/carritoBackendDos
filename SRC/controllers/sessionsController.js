import { usersDao } from "./index.js";
import { hashPassword, validaHash } from "../utils/hash.js";
import { UsersDTO } from "../dto/usersDto.js";
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";


// configuracion de las cookes de autenticacion
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.general.NODE_ENV === 'production', // Cambiar a true si se utiliza HTTPS
  sameSite: 'lax',
  maxAge: 3600000 // 1 hora en milisegundos
};

export const register = async (req, res) => {
  /** Hago las validaciones necesarias */
  let { first_name, last_name, email, password } = req.body;

  if (!first_name || !email || !password) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: 'first_name| email | password son requeridos' });
  } 
  //resto de las validaciones
  try {
    let existe = await usersDao.getBy({email});
    if (existe) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: `El correo email ${email} ya está en la BD` });
    } 

     const hashedPassword = hashPassword(password);
    const newUser = await usersDao.create({ first_name, last_name, email, password: hashedPassword });
    const usuarioDto = new UsersDTO(newUser) ;
    return res.status(201).json({
      Status: 'success',
      message: `Registro exitoso para ${first_name}`,
      newUser: usuarioDto
    });
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ status: 'error', message: 'internal server error' });
  }
}
//=========Login=======

export const login = async (req, res) => {
  let{ email, password } = req.body;

  if (!email || !password) {
  res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ status: 'error', message: 'email | password son  requeridos' });
  }

  try {
  const user = await usersDao.getBy({ email});

    if (!user)  {
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({status: 'error', message: 'Credenciales inválidas' });
    }

    if (!validaHash(password, user.password)) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    }
       const payload = { 
        id: user._id, 
        email: user.email, 
        role: user.role || 'user'
      };
      const token = jwt.sign(payload, config.general.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('currentUser', token, COOKIE_OPTIONS);
      return res.status(200).json({
        status: 'success',
        message: `Login exitoso para ${user.first_name}`, 
      });
    }catch (error) {
    console.error(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ status: 'error', message: 'internal server error' });
  }
};
    

    //=====USUARIO==========
   /** const usuarioDto = { ...new UsersDTO(user) };
     const token = jwt.sign(usuarioDto, config.general.JWT_SECRET, { expiresIn: '1h' }); 
    res.cookie('token', token, COOKIE_OPTIONS);
    return res.status(200).json({
      message: `Login exitoso para ${user.first_name}`,
      user: new UsersDTO(user),
      });
} catch (error) {
    console.error(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'internal server error' });
  }
}*/

//=========Logout=======
export const logout = async (req, res) => {
try {
    res.clearCookie('currentUser', COOKIE_OPTIONS);
return res.status(200).json({ status: 'success', message: 'Logout exitoso' });
  } catch (error) {
    console.error(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'internal server error' });
  }
    
  };
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
