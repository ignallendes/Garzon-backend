// models/usuario.model.js
import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      enum: ['Admin', 'Caja', 'Garzon'],
      default: 'Caja',
    },
    activo: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios');