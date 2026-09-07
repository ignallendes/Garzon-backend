import mongoose from "mongoose";

const solicitudSchema = new mongoose.Schema(
  {
    mesa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mesa',
      required: true,
    },
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
    tipo: {
      type: String,
      enum: ['Solicitada', 'Cuenta'], // Corregido typo 'Solicitada'
      required: true,
    },
    fecha_Solicitud: {
      type: Date,
      default: Date.now, // Se asigna automáticamente la fecha y hora actual
    },
    atendida: {
      type: Boolean,
      default: false, // Inicia como no atendida
    }
  },
  {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
  }
);

export const Solicitud = mongoose.model('Solicitud', solicitudSchema, 'solicitudes');