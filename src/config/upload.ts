import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const userPortariaFolder = path.resolve(
  __dirname,
  '..',
  '..',
  'tmp',
  'files',
  'user',
  'portaria',
);
const userDocumentFolder = path.resolve(
  __dirname,
  '..',
  '..',
  'tmp',
  'files',
  'user',
  'document',
);
const userDocumentBackFolder = path.resolve(
  __dirname,
  '..',
  '..',
  'tmp',
  'files',
  'user',
  'document_back',
);

export default {
  directory: tmpFolder,
  portariaFolder: userPortariaFolder,
  documentFolder: userDocumentFolder,
  documentBackFolder: userDocumentBackFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const extension = file.originalname.split('.').pop();
      const fileName = `${fileHash}.${extension}`;
      return callback(null, fileName);
    },
  }),
};
