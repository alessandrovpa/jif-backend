import Athlete from '../models/Athlete';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import uploadConfig from '../config/upload';
import fs from 'fs';
import path from 'path';

interface RequestDTO {
  athlete_id: string;
  delegation_id: string;
  picture: string;
  document: string;
  document_back: string;
  authorization: string;
}

class UpdateAthleteFilesService {
  public async execute({
    athlete_id,
    delegation_id,
    picture,
    document,
    document_back,
    authorization,
  }: RequestDTO): Promise<Athlete> {
    const athleteRepository = getRepository(Athlete);

    const athlete = await athleteRepository.findOne(athlete_id);
    if (!athlete) {
      throw new AppError('Athleta não encontrado');
    }

    if (athlete.delegation_id != delegation_id) {
      throw new AppError('Você não pode editar atleta de outa delegação', 401);
    }

    if (picture) {
      if (athlete.picture) {
        const athletePicturePath = path.join(
          uploadConfig.athletePictureFolder,
          athlete.picture,
        );
        const athletePictureFileExist = await fs.promises.stat(
          athletePicturePath,
        );
        if (athletePictureFileExist) {
          await fs.promises.unlink(athletePicturePath);
        }
      }
      const tmpPicture = path.join(uploadConfig.directory, picture);
      const finalPicture = path.join(
        uploadConfig.athletePictureFolder,
        picture,
      );
      fs.rename(tmpPicture, finalPicture, function (err) {
        if (err) console.log('ERROR: ' + err);
      });

      athlete.picture = picture;
    }

    if (document) {
      if (athlete.document) {
        const athleteDocumentPath = path.join(
          uploadConfig.athleteDocumentFolder,
          athlete.document,
        );
        const athleteDocumentFileExist = await fs.promises.stat(
          athleteDocumentPath,
        );
        if (athleteDocumentFileExist) {
          await fs.promises.unlink(athleteDocumentPath);
        }
      }
      const tmpDocument = path.join(uploadConfig.directory, document);
      const finalDocument = path.join(
        uploadConfig.athleteDocumentFolder,
        document,
      );
      fs.rename(tmpDocument, finalDocument, function (err) {
        if (err) console.log('ERROR: ' + err);
      });

      athlete.document = document;
    }

    if (document_back) {
      if (athlete.document_back) {
        const athleteDocumentBackPath = path.join(
          uploadConfig.athleteDocumentBackFolder,
          athlete.document_back,
        );
        const athleteDocumentBackFileExist = await fs.promises.stat(
          athleteDocumentBackPath,
        );
        if (athleteDocumentBackFileExist) {
          await fs.promises.unlink(athleteDocumentBackPath);
        }
      }
      const tmpDocumentBack = path.join(uploadConfig.directory, document_back);
      const finalDocumentBack = path.join(
        uploadConfig.athleteDocumentBackFolder,
        document_back,
      );
      fs.rename(tmpDocumentBack, finalDocumentBack, function (err) {
        if (err) console.log('ERROR: ' + err);
      });

      athlete.document_back = document_back;
    }

    if (authorization) {
      if (athlete.authorization) {
        const athleteAuthorizationPath = path.join(
          uploadConfig.athleteAuthorizationFolder,
          athlete.authorization,
        );
        const athleteAuthorizationFileExist = await fs.promises.stat(
          athleteAuthorizationPath,
        );
        if (athleteAuthorizationFileExist) {
          await fs.promises.unlink(athleteAuthorizationPath);
        }
      }
      const tmpAuthorization = path.join(uploadConfig.directory, authorization);
      const finalAuthorization = path.join(
        uploadConfig.athleteAuthorizationFolder,
        authorization,
      );
      fs.rename(tmpAuthorization, finalAuthorization, function (err) {
        if (err) console.log('ERROR: ' + err);
      });

      athlete.authorization = authorization;
    }

    await athleteRepository.save(athlete);

    fs.readdir(uploadConfig.directory, (err, files) => {
      for (const file of files) {
        fs.promises.unlink(path.join(uploadConfig.directory, file));
      }
    });

    return athlete;
  }
}

export default UpdateAthleteFilesService;
