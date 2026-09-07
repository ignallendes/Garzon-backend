import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dns from 'dns';

// Resolver DNS igual que en config/db.js
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

import { Usuario } from '../models/usuario.model.js';

const crearUsuarioAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🍃 Conectado a MongoDB para ejecutar el seed...');

    const adminUsername = 'admin';
    const adminPassword = 'AdminPassword123!';

    // Verificar si ya existe un usuario admin
    const existeAdmin = await Usuario.findOne({ username: adminUsername });

    if (existeAdmin) {
      console.log('⚠️ El usuario Administrador ya existe en la base de datos.');
      process.exit(0);
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Crear usuario Administrador inicial
    await Usuario.create({
      username: adminUsername,
      nombre: 'Administrador Principal',
      password: hashedPassword,
      rol: 'Admin'
    });

    console.log('✅ Usuario Administrador creado exitosamente:');
    console.log(`   - Username: ${adminUsername}`);
    console.log(`   - Password: ${adminPassword}`);
    console.log(`   - Rol: Admin`);

  } catch (error) {
    console.error('❌ Error ejecutando el seed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB.');
    process.exit(0);
  }
};

crearUsuarioAdmin();