import userModel from "../models/user.model.js";

export default class UserDAO {
    getAll = async () => await userModel.find().lean().exec();
    getOne = async (user) => await userModel.findOne(user);
    getById = async (id) => await userModel.findById(id).lean().exec();
    create = async (user) => await userModel.create(user);
    update = async (id, data) => await userModel.findByIdAndUpdate(id, data, { new: true });
    delete = async (id) => await userModel.findByIdAndDelete(id);
    getAllInactiveUsers = async (data) => await userModel.find({ last_connection: { $lt: data } });
}