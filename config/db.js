import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`🍃 Conectado a MongoDB Atlas → Base "${conn.connection.name}"`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};