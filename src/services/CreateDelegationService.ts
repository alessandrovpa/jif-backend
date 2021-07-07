import { getRepository } from 'typeorm';
import Delegation from '../models/Delegation';

interface Request {
  name: string;
  abreviation: string;
}

class CreateDelegationService {
  public async execute({ name, abreviation }: Request): Promise<Delegation> {
    const delegationRepository = getRepository(Delegation);
    const verifyNameAlreadyUsed = await delegationRepository.findOne({ name });
    if (verifyNameAlreadyUsed) {
      throw Error('Nome de delegação já utilizado');
    }
    const verifyAbreviationAlreadyUsed = await delegationRepository.findOne({
      abreviation,
    });
    if (verifyAbreviationAlreadyUsed) {
      throw Error('Abreviação de delegação já utilizado');
    }
    const delegation = delegationRepository.create({ name, abreviation });
    await delegationRepository.save(delegation);
    return delegation;
  }
}

export default CreateDelegationService;
