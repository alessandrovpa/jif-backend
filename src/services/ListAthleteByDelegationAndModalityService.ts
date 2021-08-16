import Athlete from '../models/Athlete';
import { getRepository } from 'typeorm';

interface Request {
  delegation_id: string;
  modality_id: string;
}

class ListAthleteByDelegationAndModalityService {
  public async execute({
    delegation_id,
    modality_id,
  }: Request): Promise<Athlete[]> {
    const athleteRepository = getRepository(Athlete);
    const athletes = await athleteRepository
      .createQueryBuilder('athlete')
      .leftJoinAndSelect('athlete.modalities', 'modality')
      .where('modality.id = :modality_id and delegation_id = :delegation_id', {
        modality_id,
        delegation_id,
      })
      .select(['athlete.id', 'athlete.name', 'athlete.identity'])
      .getMany();

    return athletes;
  }
}

export default ListAthleteByDelegationAndModalityService;
