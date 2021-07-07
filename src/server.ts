import 'reflect-metadata';
import express from 'express';
const port = 3333;
import routes from './routes/routes';

const app = express();
import './database';

app.use(express.json());

app.use(routes);

app.listen(port, () => {
  console.log('Server started on port ', port);
});
