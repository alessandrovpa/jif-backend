import Athlete from '../models/Athlete';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

class FindAthleteService {
  public async execute(athlete_id: string): Promise<Athlete> {
    const athleteRepository = getRepository(Athlete);
    const athlete = await athleteRepository.findOne(athlete_id, {
      relations: ['modalities'],
    });
    if (!athlete) {
      throw new AppError('Atleta não encontrato');
    }

    return athlete;
  }
}

export default FindAthleteService;
