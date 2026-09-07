import mongoose from "mongoose";

const salonSchema = new mongoose.Schema(

    {

        nombre: {

            type: String,

            required: true,

            unique: true,

            trim: true

        }

    }

)


export const Salon = mongoose.model('Salon', salonSchema, 'salones')