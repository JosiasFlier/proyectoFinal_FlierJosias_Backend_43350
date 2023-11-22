import UserDTO from "../dto/users.dto.js";
import { logger } from "../logger.js"
import { UserService } from "../services/users.service.js";
import { accountDeleted, accountDeletedDueToInactivity } from "./mails.controller.js";

// Controlador para obtener una lista de todos los usuarios
export const usersController = async (req, res) => {
    try {

        const allUsers = await UserService.getAll()
        const userInfo = {
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            fullName: `${req.session.user.first_name} ${req.session.user.last_name}`,
            email: req.session.user.email,
            age: req.session.user.age,
            cartId: req.session.user.cart,
            role: req.session.user.role
        };

        //Bolleanos para las vistas del navBar
        let admin
        let premium
        if (userInfo) {
            admin = userInfo?.role === "admin" ? true : false;
            premium = userInfo?.role === "premium" ? true : false;
        }

        res.render("users", { users: allUsers, userInfo, admin, premium });
    } catch (err) {
        logger.error("Error al obtener la lista de usuarios", err.message)
        res.status(500).json({ error: err });
    }
}

export const updatedUserRoleController = async (req, res) => {
    try {
        const userId = req.params.uid
        const user = await UserService.getById(userId)

        if (!user) {return res.status(404).json({error: "Usuario no encontrado"})}

        //Verifico si el usuario no es Admin o Premium
        if (user.role === "admin" || user.role === "premium") {
            return res.status(409).json({code: 1, error: "El ya usuario es premium o un administrador"}) 
        }


        const rolePremium = "premium" // Creo el nuevo rol

        const updatedUser = await UserService.update(userId, {role: rolePremium});// Actualizo el rol del usuario


        res.status(201).json({ 
            status: "success", 
            message: "Rol de usuario actualizado con éxito", 
            payload: updatedUser });
    } catch (err) {
        logger.error("Error al actualizar el rol del usuario", err.message)
        res.status(500).json({ error: err.message });
    }
}

export const deleteUserController = async (req, res) => {
    try {
        const userId = req.params.uid
        const user = await UserService.getById(userId)

        //Verifico si se encuentra al usuario
        if (!user) {return res.status(404).json({error: "Usuario no encontrado"})}

        const userDTO = new UserDTO(user);

        // Notifico al usuario eliminado por email
        const sendEmail = await accountDeleted(userDTO.email);

        //Elimino al usuario
        const userDeleted = await UserService.delete(userId);

        res.status(201).json({ 
            status: "success", 
            message: "Usuario eliminado con éxito", 
            payload: userDTO })
    } catch (err) {
        logger.error("Error al eliminar el usuario", err.message)
        res.status(500).json({ status: "Error al eliminar el usuario", error: err.message })
    }
}

export const removeInactiveUsersController = async (req, res) => {
    try {
        const exactDate = new Date() //Fecha exacta del momento
        const fortyEightHoursBefore = new Date(exactDate); //Fecha 48 hs antes
        fortyEightHoursBefore.setDate(exactDate.getDate() - 2);

        //Busco los usuarios con mas de 48 hs de inactividad
        const inactiveUsers = await UserService.getAllInactiveUsers(fortyEightHoursBefore);

        const usersDTO = inactiveUsers.map((user) => new UserDTO(user));
        
        // Filtrar usuarios que no sean admin
        const filteredInactiveUsers = usersDTO.filter((user) => user.role !== 'admin');

        // Obtener las direcciones de emails de los usuarios inactivos
        const emailsFromDeletedAccounts = filteredInactiveUsers.map(user => user.email);

        // Notifico a los usuarios eliminados por email
        const sendEmail = await accountDeletedDueToInactivity(emailsFromDeletedAccounts);
        
        // Eliminar usuarios inactivos filtrados
        for (const user of filteredInactiveUsers) {
            await UserService.delete(user.id);
        }
        

        res.status(201).json({ 
            status: "success", 
            message: "Usuarios inactivos eliminados con éxito", 
            payload: filteredInactiveUsers })
    } catch (err) {
        logger.error("Error al eliminar a los usuarios inactivos", err.message)
        res.status(500).json({ status: "Error al eliminar los usuarios inactivos", error: err.message })
    }
    
}


//PRUEBA CON KATLYN cambiar premium (POST)
//http://localhost:8080/api/users/premium/655bd0159fabeb1ce4dbfbad

// eliminar usuario (DELETE)
//http://localhost:8080/api/users/655bd0f0cf23733b613eebd8

//Eliminar usuarios inactivos (DELETE)
//http://localhost:8080/api/users/inactiveUsers
