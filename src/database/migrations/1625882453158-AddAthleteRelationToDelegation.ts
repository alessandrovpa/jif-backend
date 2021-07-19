import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddAthleteRelationToDelegation1625882453158
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'athlete',
      new TableColumn({
        name: 'delegation_id',
        type: 'int',
        isNullable: false,
      }),
    );
    await queryRunner.createForeignKey(
      'athlete',
      new TableForeignKey({
        name: 'athlete_delegation',
        columnNames: ['delegation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'delegation',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('athlete', 'athlete_delegation');
    await queryRunner.dropColumn('athlete', 'delegation_id');
  }
}
