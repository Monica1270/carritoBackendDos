export class UsersDTO{
    constructor(user){
        this.nombre=user.first_Name
        this.rol=user.role
        this.email=user.email
    }
}