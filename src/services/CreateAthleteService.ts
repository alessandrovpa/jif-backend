import { getRepository } from 'typeorm';
import Athlete from '../models/Athlete';
import Modality from '../models/Modality';
import AppError from '../errors/AppError';

import formatContact from '../utils/formatContact';

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
      contact: formatContact(contact),
      nickname,
      game_id,
      delegation_id,
    });
    const listModalities: Array<Modality> = [];
    let verifyModalityLimit = {
      modality: '',
      blocked: false,
    };

    modalities.map(async modalityId => {
      const findModality = await modalityRepository.findOne(modalityId);
      if (!findModality) {
        return;
      }
      listModalities.push(findModality);
    });

    const findAthletesByDelegation = await athleteRepository.find({
      select: ['id'],
      relations: ['modalities'],
      where: {
        delegation_id,
      },
    });
    let verifyLimit = 0;
    listModalities.map(modality => {
      verifyLimit = 0;
      findAthletesByDelegation.map(athlete => {
        athlete.modalities.map(athleteModality => {
          if (athleteModality.id === modality.id) {
            verifyLimit++;
          }
        });
        if (verifyLimit >= modality.holder + modality.backup) {
          throw new AppError(
            `Limite de inscrições atingido para ${modality.name.toUpperCase()}`,
          );
        }
      });
    });
    await athleteRepository.save(athlete);
    athlete.modalities = listModalities;
    await athleteRepository.save(athlete);

    return athlete;
  }
}

export default CreateAthleteService;
