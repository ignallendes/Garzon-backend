import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/barmonitor';

export const conectarDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`🍃 Conectado a MongoDB → base "${mongoose.connection.name}"`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};