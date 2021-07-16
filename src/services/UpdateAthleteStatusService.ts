import AppError from '../errors/AppError';
import Athlete from '../models/Athlete';
import { getRepository } from 'typeorm';

interface RequestDTO {
  athlete_id: string;
  status: number;
  observation?: string;
}

class UpdateAthleteStatusService {
  public async execute({
    athlete_id,
    status,
    observation,
  }: RequestDTO): Promise<Athlete> {
    if (!athlete_id) {
      throw new AppError('Atleta inválido');
    }
    const athleteRepository = getRepository(Athlete);

    const athlete = await athleteRepository.findOne(athlete_id);
    if (!athlete) {
      throw new AppError('Atleta inválido');
    }

    if (status === 1) {
      athlete.observation = '';
      athlete.status = 1;
    } else if (status === 2 && observation) {
      athlete.observation = observation;
      athlete.status = 2;
    }
    await athleteRepository.save(athlete);
    return athlete;
  }
}

export default UpdateAthleteStatusService;
