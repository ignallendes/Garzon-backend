import express from 'express'

const app = express()
app.use(express.json())

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '¡Servidor del proyecto Garzón funcionando!' })
})

app.listen(3001, () => console.log('API en http://localhost:3001'))