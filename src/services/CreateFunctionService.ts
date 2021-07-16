import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import UserFunction from '../models/Function';

interface RequestDTO {
  name: string;
  access: number;
}

class CreateFunctionService {
  public async execute({ name, access }: RequestDTO): Promise<UserFunction> {
    const functionRepository = getRepository(UserFunction);
    const verifyFunctionAlreadyExists = await functionRepository.findOne({
      where: { name },
    });
    if (verifyFunctionAlreadyExists) {
      throw new AppError('Função já cadastrada!');
    }
    const newFunction = functionRepository.create({ name, access });
    await functionRepository.save(newFunction);

    return newFunction;
  }
}

export default CreateFunctionService;
