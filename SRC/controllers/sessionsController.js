import { usersDao } from "./index.js";
import { hashPassword, validaHash } from "../utils/hash.js";
import { UsersDTO } from "../dto/usersDto.js";
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

export const register = async (req, res) => {
  /** Hago las validaciones necesarias */
  let { first_name, last_name, email, password } = req.body;

  if (!first_name || !email || !password) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: 'first_name| email | password son requeridos' });
  } 
  //resto de las validaciones
  try {
    let existe = await usersDao.getBy({ email: email});
    if (existe) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: `El correo email ${email} ya está en la BD` });
    } 
      password=hashPassword(password)
      let newUser = await usersDao.create({ first_name, last_name, email, password });
      const usuarioDto = { ...new UsersDTO(newUser) };
      const token = jwt.sign(usuarioDto, config.general.JWT_SECRET, { expiresIn: '1h' });

      res.setHeader('Content-Type', 'application/json');
      return res.status(201).json({ 
        message: `Registro exitoso para ${first_name}`,
        newUser: new UsersDTO(newUser), 
        token: token
    });
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'internal server error' });
  }
}
export const login = async (req, res) => {
  let{ email, password } = req.body;

  if (!email || !password) {
  res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: 'email | password son  requeridos' });
  }

  try {
  let user = await usersDao.getBy({ email});

    if (!user)  {
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!validaHash(password, user.password)) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const usuarioDto = { ...new UsersDTO(user) };
     const token = jwt.sign(usuarioDto, config.general.JWT_SECRET, { expiresIn: '1h' }); 
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      message: `Login exitoso para ${user.first_name}`,
      user: new UsersDTO(user),
       token: token 
    });
} catch (error) {
    console.error(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: 'internal server error' });
  }
}
export const logout = async (req, res) => {
//req.session.destroy(error => {
   // if (error) {
      //res.setHeader('Content-Type', 'application/json');
      //return res.status(500).json({ error: 'Fallo al cerrar en el proceso de logout' });
    //} //
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ payload: 'Logout exitoso' });
    

}
