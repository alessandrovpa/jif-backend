import UserFunction from '../models/Function';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

class DeleteFunctionService {
  public async execute(function_id: string): Promise<boolean> {
    const functionRepository = getRepository(UserFunction);
    const userFunction = await functionRepository.findOne({
      where: { id: function_id },
    });
    if (!userFunction) {
      throw new AppError('Função não encontrada');
    }
    await functionRepository.remove(userFunction);
    return true;
  }
}

export default DeleteFunctionService;
