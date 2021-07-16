import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddObservationColumnOnAthlete1626144883363
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'athlete',
      new TableColumn({
        name: 'observation',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('athlete', 'observation');
  }
}
