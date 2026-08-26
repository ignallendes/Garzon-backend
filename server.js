import express from 'express'

const app = express()
app.use(express.json())
app.listen(300, () => console.log('API en http://localhost:3000'))