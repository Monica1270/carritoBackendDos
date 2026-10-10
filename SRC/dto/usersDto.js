export class UsersDTO{
    constructor(user){
        this.nombre=user.first_name
        this.rol=user.role
        this.username=user.email.split("@")[0]
    }
}