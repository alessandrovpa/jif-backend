import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import User from '../models/User';

class GetUserAccess {
  public async execute(id: string): Promise<User> {
    const userRepository = getRepository(User);
    const access = await userRepository.findOne(id, { select: ['access'] });
    if (!access) {
      throw new AppError('Usuário inválido');
    }
    return access;
  }
}

export default GetUserAccess;
