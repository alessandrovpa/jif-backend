import { getRepository } from 'typeorm';
import User from '../models/User';
import Delegation from '../models/Delegation';
import UserFunction from '../models/Function';
import { hash } from 'bcryptjs';

class CreateDefaultADMUser {
  public async execute(): Promise<User> {
    const userRepository = getRepository(User);
    const delegationRepository = getRepository(Delegation);
    const functionRepository = getRepository(UserFunction);

    const verifyUser = await userRepository.findOne({
      where: { email: 'admin@jifnacional.com' },
    });
    if (verifyUser) {
      return verifyUser;
    }

    let delegation = await delegationRepository.findOne({
      where: { name: 'COJIF' },
    });
    if (!delegation) {
      delegation = delegationRepository.create({
        name: 'COJIF',
        abreviation: 'COJIF',
      });
      await delegationRepository.save(delegation);
    }

    let userFunction = await functionRepository.findOne({
      where: { name: 'Administrador', access: 0 },
    });
    if (!userFunction) {
      userFunction = functionRepository.create({
        name: 'Administrador',
        access: 0,
      });
      await functionRepository.save(userFunction);
    }
    const hashedPassword = await hash('123456', 8);
    const user = await userRepository.create({
      name: 'Admin',
      email: 'admin@jifnacional.com',
      siape: '0',
      delegation_id: delegation.id,
      function: 'Administrador',
      access: 0,
      password: hashedPassword,
      contact: '(21) 9 82063928',
    });
    await userRepository.save(user);
    return user;
  }
}

export default CreateDefaultADMUser;
