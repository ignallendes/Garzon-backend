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

const app = express();

// Middleware base
app.use(cors());
app.use(express.json());

// 1. Inicialización de Servidor HTTP y WebSockets
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // Ajustar al dominio frontend en producción
    methods: ['GET', 'POST', 'PATCH']
  }
});

// Guardar la instancia de socket para que req.app.get('io') funcione en controladores
app.set('io', io);

// Eventos de conexión WebSocket
io.on('connection', (socket) => {
  console.log(`⚡ Cliente conectado a WebSockets: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
});

// 2. Definición de Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/salones', salonRoutes);
app.use('/api/mesas', mesaRoutes);
app.use('/api/solicitudes', solicitudRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: '¡API de BarMonitor V1.0 funcionando correctamente!' });
});

// 3. Conexión a la BD y arranque del servidor
const PORT = process.env.PORT || 3001;

conectarDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});