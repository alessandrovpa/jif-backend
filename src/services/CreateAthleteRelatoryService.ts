import { getRepository } from 'typeorm';
import Athlete from '../models/Athlete';

interface Response {
  total: number;
  aprovados: number;
  reprovados: number;
}

class CreateAthleteRelatoryService {
  public async execute(delegation_id: string): Promise<Response> {
    const athleteRepository = getRepository(Athlete);
    const total = await athleteRepository.count({
      where: {
        delegation_id,
      },
    });
    const aprovados = await athleteRepository.count({
      where: {
        delegation_id,
        status: 1,
      },
    });
    const reprovados = await athleteRepository.count({
      where: {
        delegation_id,
        status: 2,
      },
    });

    return { total, aprovados, reprovados };
  }
}

export default CreateAthleteRelatoryService;
