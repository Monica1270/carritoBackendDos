import { usersDao } from "./index.js";
import { hashPassword } from "../utils/hash.js";

export const register = async (req, res) => {
  /** Hago las validaciones necesarias */
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !email || !password) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: 'firstName, email y password son datos requeridos' });
  }

  try {
    const existe = await usersDao.getBy({ email });
    if (existe) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: `El correo electrónico ${email} ya está en uso` });
    }

    const hashedPassword = hashPassword(password);
    const newUser = await usersDao.create({
      name: firstName,
      lastName: lastName || 'Sin apellido',
      email,
      password: hashedPassword,
    });

    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({
      message: `Registro exitoso para ${firstName}`,
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'internal server error' });
  }
};