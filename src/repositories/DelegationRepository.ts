import Delegation from '../models/Delegation';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Delegation)
class DelegationRepository extends Repository<Delegation> {
  public async findByName(name: string): Promise<Delegation | void> {
    const delegation = await this.findOne({ name });
    return delegation;
  }

  public async findByAbrevation(
    abreviation: string,
  ): Promise<Delegation | void> {
    const delegation = await this.findOne({ abreviation });
    return delegation;
  }
}

export default DelegationRepository;
