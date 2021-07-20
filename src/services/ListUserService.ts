import User from '../models/User';
import { getRepository, MoreThanOrEqual } from 'typeorm';
import { classToClass } from 'class-transformer';

interface RequestDTO {
  delegation_id: string;
  access: number;
}
class ListUserService {
  public async execute({ delegation_id, access }: RequestDTO): Promise<User[]> {
    const userRepository = getRepository(User);
    let users: User[] = [];
    if (access <= 1) {
      users = await userRepository.find({ relations: ['delegation'] });
    } else if (access > 1) {
      users = await userRepository.find({
        relations: ['delegation'],
        where: {
          delegation_id,
          access: MoreThanOrEqual(access),
        },
      });
    }
    return classToClass(users);
  }
}

export default ListUserService;
