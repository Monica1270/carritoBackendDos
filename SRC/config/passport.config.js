import passport from "passport";
import passportJWT from "passport-jwt";
import local from "passport-local";
import bcrypt from "bcrypt";
import { UsersDAO } from "../dao/UsersDAO.js";


const usersDAO = new UsersDAO()

const buscaToken = req => {
    let token = null
    if (req.cookies.cookietoken) {
        token = req.cookies.cookietoken
    }
    return token
}

export const inicializarPassport = () => {
    // paso uno (uso current porque lo solicita coder)
    passport.use("current", new passportJWT.Strategy(
        {
            secretOrKey: "config.general.JWT_SECRET",
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
    //Estragegia login
    passport.use("login", new local.Strategy(
        {
            usernameField: "email",
            passReqToCallback: true,
        },
        async (req, username, password, done) => {

            try {
                const user = await usersDAO.getBy({ email: username });

                if (!user || !user.password) {

                    return done(null, false)
                }
                //validacion de password con bcrypt
                
                try {
                    let passwordValido = bcrypt.compareSync(password, user.password)
                    if (!passwordValido);{
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

            } catch (error) { 
                return done(error)

            }
        }
    )
    )

}