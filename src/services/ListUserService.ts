import User from '../models/User';
import { getRepository } from 'typeorm';

class ListUserService {
  public async execute(): Promise<User[]> {
    const userRepository = getRepository(User);
    const users = await userRepository.find({ relations: ['delegation'] });

    return users;
  }
}

export default ListUserService;
