import Athlete from '../models/Athlete';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

interface RequestDTO {
  athlete_id: string;
  access: number;
  delegation_id: string;
}

class DeleteAthleteService {
  public async execute({
    athlete_id,
    access,
    delegation_id,
  }: RequestDTO): Promise<boolean> {
    const athleteRepository = getRepository(Athlete);
    const athlete = await athleteRepository.findOne({
      where: { id: athlete_id },
      relations: ['modalities'],
    });
    if (!athlete) {
      throw new AppError('Atleta não encontrado');
    }
    if (access > 1 || athlete.delegation_id != delegation_id) {
      throw new AppError('Permissão negada');
    }
    await athleteRepository.remove(athlete);
    return true;
  }
}

export default DeleteAthleteService;
