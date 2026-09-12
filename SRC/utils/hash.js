import bcrypt from 'bcrypt';

export const hashPassword = password => bcrypt.hashSync(password, 10);// este es que lo crea, el 10 es el numero de veces que se va a hashear, es decir la cantidad de vueltas que le da al algoritmo para hacer el hash
//export const createHash=password=>bcrypt.hashSync(password, 10)

export const validaHash = (password, hash) => bcrypt.compareSync(password, hash);// este es el que lo valida, compara el hash registrado contra el hash se intenta registrar, si son iguales devuelve true, sino false