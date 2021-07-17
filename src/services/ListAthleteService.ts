import Athlete from '../models/Athlete';
import { getRepository } from 'typeorm';

class ListAthleteService {
  public async execute(delegation_id: string): Promise<Athlete[]> {
    const athleteRepository = getRepository(Athlete);
    const athletes = await athleteRepository.find({
      where: { delegation_id },
      order: {
        status: 'ASC',
      },
    });

    return athletes;
  }
}

export default ListAthleteService;
