import Modality from '../models/Modality';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

interface RequestDTO {
  name: string;
  genre: 'masculino' | 'feminino' | 'misto';
  holder: number;
  backup: number;
}

class CreateModalityService {
  public async execute({
    name,
    genre,
    holder,
    backup,
  }: RequestDTO): Promise<Modality> {
    const modalityRepository = getRepository(Modality);
    const modalityAlreadyExists = await modalityRepository.findOne(
      { name, genre },
      { select: ['id'] },
    );
    if (modalityAlreadyExists) {
      throw new AppError('Modalidade já cadastrada');
    }

    const modality = modalityRepository.create({ name, genre, holder, backup });
    await modalityRepository.save(modality);

    return modality;
  }
}

export default CreateModalityService;
