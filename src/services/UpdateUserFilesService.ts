import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface RequestDTO {
  portaria: string;
  document: string;
  document_back: string;
  user_id: string;
}

class UpdateUserFilesService {
  public async execute({
    portaria,
    document,
    document_back,
    user_id,
  }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Usuário inválido', 401);
    }

    if (user.portaria) {
      const userPortariaFilePath = path.join(
        uploadConfig.portariaFolder,
        user.portaria,
      );
      const userPortariaFileExist = await fs.promises.stat(
        userPortariaFilePath,
      );
      if (userPortariaFileExist) {
        await fs.promises.unlink(userPortariaFilePath);
      }
    }
    const tmpPortaria = path.join(uploadConfig.directory, portaria);
    const finalPortaria = path.join(uploadConfig.portariaFolder, portaria);
    fs.rename(tmpPortaria, finalPortaria, function (err) {
      if (err) console.log('ERROR: ' + err);
    });

    user.portaria = portaria;

    if (user.document) {
      const userDocumentFilePath = path.join(
        uploadConfig.documentFolder,
        user.document,
      );
      const userDocumentFileExist = await fs.promises.stat(
        userDocumentFilePath,
      );
      if (userDocumentFileExist) {
        await fs.promises.unlink(userDocumentFilePath);
      }
    }

    const tmpDocument = path.join(uploadConfig.directory, document);
    const finalDocument = path.join(uploadConfig.documentFolder, document);
    fs.rename(tmpDocument, finalDocument, () => {});

    user.document = document;

    if (user.document_back) {
      const userDocumentBackFilePath = path.join(
        uploadConfig.documentBackFolder,
        user.document_back,
      );
      const userDocumentBackFileExist = await fs.promises.stat(
        userDocumentBackFilePath,
      );
      if (userDocumentBackFileExist) {
        await fs.promises.unlink(userDocumentBackFilePath);
      }
    }

    const tmpDocumentBack = path.join(uploadConfig.directory, document_back);
    const finalDocumentBack = path.join(
      uploadConfig.documentBackFolder,
      document_back,
    );
    fs.rename(tmpDocumentBack, finalDocumentBack, () => {});

    user.document_back = document_back;

    await userRepository.save(user);

    fs.readdir(uploadConfig.directory, (err, files) => {
      for (const file of files) {
        fs.promises.unlink(path.join(uploadConfig.directory, file));
      }
    });

    return user;
  }
}

export default UpdateUserFilesService;
