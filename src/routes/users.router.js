import { Router } from "express";
import { isAdmin, isLogged } from "../public/authenticationMidd.js";
import { deleteUserController, removeInactiveUsersController, updatedUserRoleController, usersController } from "../controllers/users.controller.js";

const router = Router()

router.delete('/inactiveUsers', isLogged, isAdmin, removeInactiveUsersController) // Elimina los usuarios con inactividad de 48 hs

//Ruta para el manejo de usuarios
router.get('/', isLogged, isAdmin, usersController) // Listado de usuarios activos

router.post("/premium/:uid", isLogged, isAdmin, updatedUserRoleController) // Actualizar a premium a un usuario

router.delete('/:uid', isLogged, isAdmin, deleteUserController) // Eliminar un usuario


export default router