import mongoose from "mongoose";

// Modelo para recuperacion de contraseña

const userPasswordCollection = 'userPasswords'

const userPasswordSchema = new mongoose.Schema({
    email: { type: String, ref: "users" },
    token: { type: String, required: true },
    isUsed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expireAfterSeconds: 3600 },
})

mongoose.set("strictQuery", false)
const UserPasswordModel = mongoose.model(userPasswordCollection, userPasswordSchema)

export default UserPasswordModel