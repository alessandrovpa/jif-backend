import Modality from '../models/Modality';
import { getRepository } from 'typeorm';

class ListModalityService {
  public async execute(genre: string): Promise<Modality[]> {
    const modalityRepository = getRepository(Modality);
    let modalities: Modality[];

    if (genre) {
      modalities = await modalityRepository.find({
        where: [{ genre }, { genre: 'misto' }],
      });
    } else {
      modalities = await modalityRepository.find();
    }

    return modalities;
  }
}

export default ListModalityService;
