import passport from "passport";
import passportJWT from "passport-jwt";
import local from "passport-local";
import bcrypt from "bcrypt";
import { UsersDAO } from "../dao/UsersDAO.js";
import { config } from "./config.js";
import github from "passport-github2";




const usersDAO = new UsersDAO()

const buscaToken = (req) => {
  let token = null
  if (req.cookies.currentUser) {
    token = req.cookies.currentUser
  }
  return token
}

export const initPassport = () => {
  passport.use("github", new github.Strategy(
    {
      callbackURL: "https://localhost:8080/api/sessions/callbackGithub",
      clientSecret: "3020be7223f0a9a885e41182dd6b962a6fbb3e5e",
      clientID: " Iv23li9ZJ9SGMM2iA7d8",
    },
    async(t1, t2, profile, done) => {
      try {
        console.log(profile)
        return done(null, {_id: profile.id, name: profile.displayName, email: profile.emails[0].value})
    }catch (error) {
      return done(error)
    } 
  }
)
  ) 
}


export const inicializarPassport = () => {
  // paso uno (uso current porque lo solicita coder)
  passport.use("current", new passportJWT.Strategy(
    {
      secretOrKey: config.general.JWT_SECRET,
      jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscaToken])
    },
    async (payLoad, done) => {

      try {
        return done(null, payLoad)
      }
      catch (error) {
        return done(error)
      }
    }
  )
  )
  // 2. Estrategia Local "register"
  passport.use(
    "register",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name } = req.body;

          // Verificar si el usuario ya existe
          const existe = await usersDAO.getBy({ email: username });
          if (existe) {
            return done(null, false, { message: "El usuario ya existe" });
          }

          // Hashear password y crear usuario
          const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
          const nuevoUsuario = await usersDAO.create({
            first_name,
            last_name,
            email: username,
            password: hashedPassword,
          });

          return done(null, nuevoUsuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Estragegia login
  passport.use("login", new local.Strategy(
    {
      usernameField: "email",
      //passReqToCallback: true,
    },
    async (username, password, done) => {

      try {
        const user = await usersDAO.getBy({ email: username });

        if (!user || !user.password) {

          return done(null, false)
        }
        //validacion de password con bcrypt


         try {
             let passwordValido = bcrypt.compareSync(password, user.password)
             if (!passwordValido){
             return done(null, false) } 

             return done (null, user)
             }
             catch(bcryptError){
             return done (bcryptError)
         } 

        //armando el payload para el token
        /*  const payload = {
             id: user._id,
             email: user.email,
             role: user.role || 'user'
         };*/
      /*   const passwordValido = bcrypt.compareSync(password, user.password);
        if (!passwordValido) {
          return done(null, false);
        }
 
        return done(null, user);*/


      } catch (error) {
        return done(error)

      }
    }
  )
  )

}