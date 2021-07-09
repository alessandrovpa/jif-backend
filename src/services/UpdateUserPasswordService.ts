import { getRepository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../errors/AppError';

interface RequestDTO {
  old_password: string;
  new_password: string;
  confirm_password: string;
  user_id: string;
}

class UpdateUserPassword {
  public async execute({
    old_password,
    new_password,
    confirm_password,
    user_id,
  }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(user_id);
    if (!user) {
      throw new AppError('Usuário inválido', 401);
    }
    const verifyPassword = await compare(old_password, user.password);
    if (!verifyPassword) {
      throw new AppError('Senha incorreta', 401);
    }

    if (new_password != confirm_password) {
      throw new AppError('Senha de confirmação inválida!');
    }

    const hashedPassword = await hash(new_password, 8);
    user.password = hashedPassword;
    await userRepository.save(user);
    delete user.password;
    return user;
  }
}

export default UpdateUserPassword;
