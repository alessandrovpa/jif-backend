import User from '../models/User';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

class FindUserService {
  public async execute(user_id: string): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(user_id, {
      relations: ['delegation'],
    });
    if (!user) {
      throw new AppError('Usuário não encontrado');
    }
    return user;
  }
}

export default FindUserService;
