import dotenv from 'dotenv';
dotenv.config(); // Carga las variables antes de importar el resto de módulos

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

import { conectarDB } from './config/db.js';

// Rutas
import authRoutes from './routes/auth.routes.js';
import salonRoutes from './routes/salon.routes.js';
import mesaRoutes from './routes/mesa.routes.js';
import solicitudRoutes from './routes/solicitud.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Servidor HTTP + Socket.io
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`⚡ Cliente WebSockets conectado: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
});

// Registrar Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/salones', salonRoutes);
app.use('/api/mesas', mesaRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: '¡API BarMonitor V1.0 funcionando!' });
});

// Inicio
const PORT = process.env.PORT || 3001;

conectarDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  });
});