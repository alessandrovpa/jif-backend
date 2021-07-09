import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import User from '../../models/User';
import Delegation from '../../models/Delegation';
import { hash } from 'bcryptjs';

export class AddDefaultAdminUser1625792507320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const delegationRepository = getRepository(Delegation);
    const delegation = delegationRepository.create({
      name: 'COJIF',
      abreviation: 'COJIF',
    });
    await delegationRepository.save(delegation);

    const userRepository = getRepository(User);
    const hashedPassword = await hash('123456', 8);
    const user = userRepository.create({
      name: 'ADMIN',
      email: 'admin@admin.com',
      siape: 'admin',
      contact: '0',
      access: 0,
      delegation_id: delegation.id,
      password: hashedPassword,
    });
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
