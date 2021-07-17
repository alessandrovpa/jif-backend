import { getRepository, Not } from 'typeorm';
import Athlete from '../models/Athlete';
import Modality from '../models/Modality';
import AppError from '../errors/AppError';

import formatContact from '../utils/formatContact';

interface RequestDTO {
  id: string;
  name: string;
  email: string;
  birth: Date;
  identity: string;
  genre: 'masculino' | 'feminino';
  contact: string;
  nickname: string;
  game_id: string;
  modalities: Array<string>;
}

class UpdateAthleteService {
  public async execute({
    id,
    name,
    email,
    birth,
    identity,
    genre,
    contact,
    nickname,
    game_id,
    modalities,
  }: RequestDTO): Promise<Athlete> {
    const athleteRepository = getRepository(Athlete);
    const modalityRepository = getRepository(Modality);

    const athlete = await athleteRepository.findOne(id);
    if (!athlete) {
      throw new AppError('Atleta não encontrado');
    }

    const verifyEmailAlreadyUsed = await athleteRepository.findOne(
      { email, id: Not(id) },
      { select: ['id'] },
    );
    if (verifyEmailAlreadyUsed) {
      throw new AppError('Email já cadastrado por outro atleta');
    }

    const verifyIdentityAlreadyUsed = await athleteRepository.findOne(
      {
        identity,
        id: Not(id),
      },
      { select: ['id'] },
    );
    if (verifyIdentityAlreadyUsed) {
      throw new AppError('Identidade já cadastrada por outro atleta');
    }

    athlete.name = name;
    athlete.email = email;
    athlete.birth = birth;
    athlete.identity = identity;
    athlete.genre = genre;
    (athlete.contact = formatContact(contact)), (athlete.nickname = nickname);
    athlete.game_id = game_id;
    athlete.status = 0;
    athlete.observation = '';

    const listModalities: Array<Modality> = [];

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
        delegation_id: athlete.delegation_id,
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

export default UpdateAthleteService;
