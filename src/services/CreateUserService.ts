import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import Delegation from '../models/Delegation';
import AppError from '../errors/AppError';

interface RequestDTO {
  name: string;
  email: string;
  siape: string;
  contact: string;
  access: number;
  delegation_id: string;
}

class CreateUserService {
  public async execute({
    name,
    email,
    siape,
    contact,
    access,
    delegation_id,
  }: RequestDTO): Promise<User> {
    const delegationRepository = getRepository(Delegation);
    const userRepository = getRepository(User);

    const verifyEmailAlreadyUsed = await userRepository.findOne({ email });
    if (verifyEmailAlreadyUsed) {
      throw new AppError('Este email já está em uso');
    }

    const verifyDelegationExist = await delegationRepository.findOne(
      delegation_id,
    );
    if (!verifyDelegationExist) {
      throw new AppError('Invalid delegation');
    }

    const hashedPassword = await hash('123456', 8);

    const user = await userRepository.create({
      name,
      email,
      siape,
      password: hashedPassword,
      contact,
      delegation_id,
    });

    await userRepository.save(user);

    delete user.password;
    return user;
  }
}

export default CreateUserService;
