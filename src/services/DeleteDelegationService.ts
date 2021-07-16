import Delegation from '../models/Delegation';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

interface RequestDTO {
  delegation_id: string;
  access: number;
}

class DeleteDelegationService {
  public async execute({
    delegation_id,
    access,
  }: RequestDTO): Promise<boolean> {
    const delegationRepository = getRepository(Delegation);
    const delegation = await delegationRepository.findOne({
      where: { id: delegation_id },
    });
    if (!delegation) {
      throw new AppError('Delegação não encontrada');
    }
    if (access > 1) {
      throw new AppError('Permissão negada');
    }
    await delegationRepository.remove(delegation);
    return true;
  }
}

export default DeleteDelegationService;
