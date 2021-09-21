import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import Delegation from '../models/Delegation';
import UserFunction from '../models/Function';
import AppError from '../errors/AppError';
import { classToClass } from 'class-transformer';

import formatContact from '../utils/formatContact';

interface RequestDTO {
  name: string;
  email: string;
  siape: string;
  contact: string;
  delegation_id: string;
  function_id: string;
}

class CreateUserService {
  public async execute({
    name,
    email,
    siape,
    contact,
    delegation_id,
    function_id,
  }: RequestDTO): Promise<User> {
    const delegationRepository = getRepository(Delegation);
    const userRepository = getRepository(User);
    const funcitonRepository = getRepository(UserFunction);

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

    if (!function_id) {
      throw new AppError('Function not provided');
    }

    const userFunction = await funcitonRepository.findOne(function_id);
    if (!userFunction) {
      throw new AppError('Function not provided');
    }

    const hashedPassword = await hash('123456', 8);

    const user = await userRepository.create({
      name,
      email,
      siape,
      password: hashedPassword,
      contact: formatContact(contact),
      delegation_id,
      access: userFunction.access,
      function: userFunction.name,
    });

    await userRepository.save(user);

    return classToClass(user);
  }
}

export default CreateUserService;
