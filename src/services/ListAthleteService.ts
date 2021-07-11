import Athlete from '../models/Athlete';
import { getRepository } from 'typeorm';

class ListAthleteService {
  public async execute(delegation_id: string): Promise<Athlete[]> {
    const athleteRepository = getRepository(Athlete);
    const athletes = await athleteRepository.find({
      delegation_id,
    });

    return athletes;
  }
}

export default ListAthleteService;
