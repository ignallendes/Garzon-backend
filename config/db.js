import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Forzar a Node.js a resolver SRV usando los servidores DNS de Google
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

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