import User from '../models/User';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

interface RequestDTO {
  user_id: string;
  access: number;
}

class DeleteUserService {
  public async execute({ user_id, access }: RequestDTO): Promise<boolean> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new AppError('Usuário não encontrado');
    }
    if (user.access < access) {
      throw new AppError('Permissão negada');
    }
    await userRepository.remove(user);
    return true;
  }
}

export default DeleteUserService;
