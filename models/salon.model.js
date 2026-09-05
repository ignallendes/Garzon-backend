import mongoose from "mongoose";

const salonSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        }
    }
)

export const Salon = mongoose.model('Salon', salonSchema, 'salones')