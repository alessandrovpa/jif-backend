import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import Delegation from '../models/Delegation';

interface RequestDTO {
  name: string;
  email: string;
  siape: string;
  contact: string;
  portaria: string;
  document: string;
  document_back: string;
  access: number;
  delegation_id: string;
}

class CreateUserService {
  public async execute({
    name,
    email,
    siape,
    contact,
    portaria,
    document,
    document_back,
    access,
    delegation_id,
  }: RequestDTO): Promise<User> {
    const delegationRepository = getRepository(Delegation);
    const userRepository = getRepository(User);

    const verifyEmailAlreadyUsed = await userRepository.findOne({ email });
    if (verifyEmailAlreadyUsed) {
      throw Error('Este email já está em uso');
    }

    const verifyDelegationExist = await delegationRepository.findOne(
      delegation_id,
    );
    if (!verifyDelegationExist) {
      throw Error('Invalid delegation');
    }

    const hashedPassword = await hash('123456', 8);

    const user = await userRepository.create({
      name,
      email,
      siape,
      password: hashedPassword,
      contact,
      portaria,
      document,
      document_back,
      access,
      delegation_id,
    });

    await userRepository.save(user);

    delete user.password;
    return user;
  }
}

export default CreateUserService;
