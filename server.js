import express from 'express';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import salonRoutes from './routes/salon.routes.js';
import mesaRoutes from './routes/mesa.routes.js';
import solicitudRoutes from './routes/solicitud.routes.js';

const app = express();
app.use(express.json());

// Montar endpoints API
app.use('/api/auth', authRoutes);
app.use('/api/salones', salonRoutes);
app.use('/api/mesas', mesaRoutes);
app.use('/api/solicitudes', solicitudRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '¡Servidor del proyecto Garzón funcionando!' });
});

app.listen(3001, () => console.log('API en http://localhost:3001'));