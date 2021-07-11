import Modality from '../models/Modality';
import { getRepository } from 'typeorm';

class ListModalityService {
  public async execute(genre: string): Promise<Modality[]> {
    const modalityRepository = getRepository(Modality);

    const modalities = await modalityRepository.find({
      where: [{ genre }, { genre: 'misto' }],
    });

    return modalities;
  }
}

export default ListModalityService;
