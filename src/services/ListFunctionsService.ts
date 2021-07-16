import { getRepository, MoreThanOrEqual } from 'typeorm';
import UserFunction from '../models/Function';

class ListFunctionsService {
  public async execute(user_acces: number): Promise<UserFunction[]> {
    const functionRepository = getRepository(UserFunction);
    const functions = await functionRepository.find({
      where: {
        access: MoreThanOrEqual(user_acces),
      },
    });

    return functions;
  }
}

export default ListFunctionsService;
