import UserDAO from "../dao/users.mongo.dao.js";

import UserRepository from "../repositories/users.repository.js";

export const UserService = new UserRepository(new UserDAO())