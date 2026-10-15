import mongoose from "mongoose";

const mesaSchema = mongoose.Schema(
    {
        numero: {
            type: Number,
            required: true,
            unique: true
        },
        estado: {
            type: String,
            enum: ['Libre', 'Ocupada', 'Solicitud', 'Cuenta'],
            default: 'Libre',
        },
        qr_token: {
            type: String,
            required: true,
            unique: true
        },
        salon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Salon',
            required: true
        }
    }
)

export const Mesa = mongoose.model('Mesa', mesaSchema, 'mesas')