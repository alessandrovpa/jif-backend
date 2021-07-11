import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
const port = 3333;
import routes from './routes/routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

const app = express();
import './database';

app.use(express.json());

app.use(
  '/files/user/portaria',
  express.static(uploadConfig.userPortariaFolder),
);
app.use(
  '/files/user/document',
  express.static(uploadConfig.userDocumentFolder),
);
app.use(
  '/files/user/document_back',
  express.static(uploadConfig.userDocumentBackFolder),
);

app.use(
  '/files/athlete/pictire',
  express.static(uploadConfig.athletePictureFolder),
);
app.use(
  '/files/athlete/document',
  express.static(uploadConfig.athleteDocumentFolder),
);
app.use(
  '/files/athlete/document_back',
  express.static(uploadConfig.athleteDocumentBackFolder),
);
app.use(
  '/files/athlete/authorization',
  express.static(uploadConfig.athleteAuthorizationFolder),
);

app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ status: 'error', error: err.message });
  }
  console.log(err);
  return res
    .status(500)
    .json({ status: 'error', message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log('Server started on port ', port);
});
