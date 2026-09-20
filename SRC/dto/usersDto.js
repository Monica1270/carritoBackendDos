export class UsersDTO{
    constructor(user){
        this.nombre=user.first_name
        this.rol=user.role
        this.email=user.email
    }
}