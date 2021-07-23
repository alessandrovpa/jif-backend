import User from '../models/User';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import { classToClass } from 'class-transformer';

interface RequestDTO {
  user_id: string;
  access: number;
  delegation_id: string;
}

class FindUserService {
  public async execute({
    user_id,
    access,
    delegation_id,
  }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(user_id, {
      relations: ['delegation'],
    });
    if (!user) {
      throw new AppError('Usuário não encontrado');
    }
    if (access > 1 && delegation_id != user.delegation_id) {
      throw new AppError('Permission denied');
    }
    return classToClass(user);
  }
}

export default FindUserService;
