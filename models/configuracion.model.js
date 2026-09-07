// models/configuracion.model.js
import mongoose from "mongoose";

const configuracionSchema = new mongoose.Schema(
  {
    nombreNegocio: {
      type: String,
      required: true,
      default: "Mi Bar / Restaurante",
    },
    mensajeBienvenida: {
      type: String,
      default: "¡Bienvenido! Escanea y solicita la atención de tu garzón.",
    },
    redesSociales: {
      instagram: String,
      wifiNombre: String,
      wifiClave: String,
    }
  },
  { timestamps: true }
);

export const Configuracion = mongoose.model('Configuracion', configuracionSchema, 'configuracion');