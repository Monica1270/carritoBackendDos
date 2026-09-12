import { usersDao } from "./index.js";
import { hashPassword, validaHash } from "../utils/hash.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email y password son datos requeridos' });
  }

  try {
    const user = await usersDao.getBy({ email: email.trim().toLowerCase() });

    if (!user || !validaHash(password, user.password)) {
      return res.status(401).json({ error: 'Email o password incorrectos' });
    }

    const { password: _password, ...payload } = user;
    return res.status(200).json({ message: 'Login exitoso', payload });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'internal server error' });
  }
};

export const register = async (req, res) => {
  /** Hago las validaciones necesarias */
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !email || !password) {
    
    return res.status(400).json({ error: 'first_name, email y password son datos requeridos' });
  } 
   // 2. Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "error",
      message: "Formato de email inválido"
    });
  }

  try 
  // Normalizo el correo electrónico para evitar problemas de mayúsculas/minúsculas y espacios
  {const normalizedEmail = email.trim().toLowerCase();
    // Verifico si el correo electrónico ya está registrado en la base de datos
    const existe = await usersDao.getBy({ email: normalizedEmail });
    if (existe) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(409).json({ error: `El correo electrónico ${normalizedEmail} ya está en uso` });
    }
//hashear y crear el usuario
    const hashedPassword = hashPassword(password);
    const createdUser = await usersDao.create({
      first_name,
      last_name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user', // Asignar el rol predeterminado como 'user'
    });
    //Payload sin password
    const payload = {
      id: createdUser._id,
      first_name: createdUser.first_name,
      last_name: createdUser.last_name,
      email: createdUser.email,
      role: createdUser.role,
    };

    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({
      message: `Registro exitoso para ${first_name}`,
      payload,
    });
  } catch (error) {
    console.error(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'internal server error' });
  }
};