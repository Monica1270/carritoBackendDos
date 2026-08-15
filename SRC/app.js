import express from 'express';
import { productsRouter } from './routes/products.router.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productsRouter);

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send('<h1>Bienvenido al servidor Express 🔟</h1>');
});
app.get('/test', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send({ message: 'Test OK' });
});

const server = app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});