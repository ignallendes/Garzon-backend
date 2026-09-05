import mongoose from "mongoose";

const mesaSchema = mongoose.Schema(
    {
        numero :{
            type : Number,
            required : true,
        },
        estado : {
            type: String,
            enum: ['Libre','Ocupada','Solicitud','Cuenta'],
            default: 'Libre',
        },
        qr_token:{
            type: String,
            required: true,
        },
        salon : {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'Salon'
        }
    }
)

export const Mesa = mongoose.model('Mesa', mesaSchema, 'mesas')