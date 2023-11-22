//Filtrar los datos del usuario autenticado para no brindar datos sensibles
export default class UserDTO {
    constructor(user) {
        this.id = user._id
        this.fullname = `${user.first_name} ${user.last_name}`
        this.email = user.email
        this.role = user.role
    }
}