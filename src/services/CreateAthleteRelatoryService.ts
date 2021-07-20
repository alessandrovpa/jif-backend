import { getRepository } from 'typeorm';
import Athlete from '../models/Athlete';

interface Response {
  total: number;
  aprovados: number;
  reprovados: number;
}

interface RequestDTO {
  delegation_id: string;
  access: number;
}

class CreateAthleteRelatoryService {
  public async execute({
    delegation_id,
    access,
  }: RequestDTO): Promise<Response> {
    const athleteRepository = getRepository(Athlete);
    if (access > 1) {
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
    const total = await athleteRepository.count();
    const aprovados = await athleteRepository.count({
      where: {
        status: 1,
      },
    });
    const reprovados = await athleteRepository.count({
      where: {
        status: 2,
      },
    });

    return { total, aprovados, reprovados };
  }
}

export default CreateAthleteRelatoryService;
