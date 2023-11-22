export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAll = async () => await this.dao.getAll() // Traer todos los usuarios
    getOne = async (user) => await this.dao.getOne(user) // Traer un usuario
    getById = async (id) => await this.dao.getById(id) // Traer un usuario por su ID
    create = async (data) => await this.dao.create(data) // Crear un usuario
    update = async (id, data) => await this.dao.update(id, data) // Actualizar un usuario
    delete = async (id) => await this.dao.delete(id) // Eliminar un usuario
    getAllInactiveUsers = async (data) => await this.dao.getAllInactiveUsers(data); //Encuentra usuarios inactivos basados en su última conexión
}