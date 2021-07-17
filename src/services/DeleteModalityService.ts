import Modality from '../models/Modality';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

class DeleteModalityService {
  public async execute(modality_id: string): Promise<boolean> {
    const modalityRepository = getRepository(Modality);
    const modality = await modalityRepository.findOne({
      where: { id: modality_id },
    });
    if (!modality) {
      throw new AppError('Modalidade não encontrada');
    }
    await modalityRepository.remove(modality);
    return true;
  }
}

export default DeleteModalityService;
