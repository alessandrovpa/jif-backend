import { getRepository } from 'typeorm';
import Athlete from '../models/Athlete';
import Delegation from '../models/Delegation';
import Modality from '../models/Modality';

interface Relatory {
  modality: String;
  count: Number;
}

interface Response {
  delegation: String;
  relatory: Relatory[];
}

class CreateModalityRelatoryService {
  public async execute(): Promise<Response[]> {
    const finalRelatory: Response[] = [];
    let modalityRelatory: Relatory[] = [];
    const delegationRepository = getRepository(Delegation);
    const modalityRepository = getRepository(Modality);
    const delegations = await delegationRepository.find({
      select: ['id', 'abreviation'],
    });
    const modalities = await modalityRepository.find({
      select: ['id', 'name', 'genre'],
    });
    let countAthletes = 0;
    const athleteRepository = getRepository(Athlete);
    await Promise.all(
      delegations.map(async delegation => {
        modalityRelatory = [];
        countAthletes = 0;
        await Promise.all(
          modalities.map(async modality => {
            let id = modality.id;
            countAthletes = await athleteRepository
              .createQueryBuilder('athlete')
              .leftJoinAndSelect('athlete.modalities', 'modality')
              .where('modality.id = :id', { id })
              .where('delegation_id = :id', { id: delegation.id })
              .getCount();
            if (countAthletes === 0) return modality;
            modalityRelatory.push({
              modality: `${modality.name.toUpperCase()} - ${modality.genre.toUpperCase()}`,
              count: countAthletes,
            });
            return modality;
          }),
        );
        finalRelatory.push({
          delegation: `${delegation.abreviation}`,
          relatory: modalityRelatory,
        });
        return delegation;
      }),
    );

    return finalRelatory;
  }
}

export default CreateModalityRelatoryService;
