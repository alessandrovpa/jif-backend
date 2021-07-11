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

const athletePictureFolder = path.resolve(
  __dirname,
  '..',
  '..',
  'tmp',
  'files',
  'athlete',
  'picture',
);
const athleteDocumentFolder = path.resolve(
  __dirname,
  '..',
  '..',
  'tmp',
  'files',
  'athlete',
  'document',
);
const athleteDocumentBackFolder = path.resolve(
  __dirname,
  '..',
  '..',
  'tmp',
  'files',
  'athlete',
  'document_back',
);
const athleteAuthorizationFolder = path.resolve(
  __dirname,
  '..',
  '..',
  'tmp',
  'files',
  'athlete',
  'authorization',
);

export default {
  directory: tmpFolder,

  userPortariaFolder,
  userDocumentFolder,
  userDocumentBackFolder,

  athletePictureFolder,
  athleteDocumentFolder,
  athleteDocumentBackFolder,
  athleteAuthorizationFolder,

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
