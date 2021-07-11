import { getRepository } from 'typeorm';
import Athlete from '../models/Athlete';
import Modality from '../models/Modality';
import AppError from '../errors/AppError';

interface RequestDTO {
  name: string;
  email: string;
  birth: Date;
  identity: string;
  genre: 'masculino' | 'feminino';
  contact: string;
  nickname: string;
  game_id: string;
  modalities: Array<string>;
  delegation_id: string;
}

class CreateAthleteService {
  public async execute({
    name,
    email,
    birth,
    identity,
    genre,
    contact,
    nickname,
    game_id,
    modalities,
    delegation_id,
  }: RequestDTO): Promise<Athlete> {
    const athleteRepository = getRepository(Athlete);
    const modalityRepository = getRepository(Modality);

    const verifyEmailAlreadyUsed = await athleteRepository.findOne(
      { email },
      { select: ['id'] },
    );
    if (verifyEmailAlreadyUsed) {
      throw new AppError('Email já cadastrado');
    }

    const verifyIdentityAlreadyUsed = await athleteRepository.findOne(
      {
        identity,
      },
      { select: ['id'] },
    );
    if (verifyIdentityAlreadyUsed) {
      throw new AppError('Identidade já cadastrada!');
    }

    const athlete = athleteRepository.create({
      name,
      email,
      birth,
      identity,
      genre,
      contact,
      nickname,
      game_id,
      delegation_id,
    });
    await athleteRepository.save(athlete);
    const listModalities: Array<Modality> = [];
    modalities.map(async modalityId => {
      let findModality = await modalityRepository.findOne(modalityId);
      if (!findModality) {
        return;
      }
      listModalities.push(findModality);
    });
    athlete.modalities = listModalities;
    await athleteRepository.save(athlete);

    return athlete;
  }
}

export default CreateAthleteService;
