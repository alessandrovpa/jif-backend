import Athlete from '../models/Athlete';
import Modality from '../models/Modality';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

interface Response {
  modality: string;
  athletes: Athlete[];
}

class ListAthletesByModality {
  public async execute(modality_id: string): Promise<Response> {
    const athleteRepository = getRepository(Athlete);
    const modalityRepository = getRepository(Modality);
    const modality = await modalityRepository.findOne(modality_id, {
      select: ['name', 'genre'],
    });
    if (!modality) {
      throw new AppError('Modalidade inválida!');
    }
    const athletes = await athleteRepository
      .createQueryBuilder('athlete')
      .leftJoinAndSelect('athlete.modalities', 'modality')
      .leftJoinAndSelect('athlete.delegation', 'delegation')
      .where('modality.id = :modality_id', { modality_id })
      .select([
        'athlete.id',
        'athlete.name',
        'modality.name',
        'modality.genre',
        'athlete.nickname',
        'athlete.game_id',
        'athlete.contact',
        'athlete.email',
        'delegation.abreviation',
      ])
      .orderBy('delegation.name', 'ASC')
      .getMany();

    return { modality: `${modality.name} - ${modality.genre}`, athletes };
  }
}

export default ListAthletesByModality;
