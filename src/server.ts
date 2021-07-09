import 'reflect-metadata';
import express from 'express';
const port = 3333;
import routes from './routes/routes';
import uploadConfig from './config/upload';

const app = express();
import './database';

app.use(express.json());

app.use('/files/user/portaria', express.static(uploadConfig.portariaFolder));
app.use('/files/user/document', express.static(uploadConfig.documentFolder));
app.use(
  '/files/user/document_back',
  express.static(uploadConfig.documentBackFolder),
);

app.use(routes);

app.listen(port, () => {
  console.log('Server started on port ', port);
});
