import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddUserRelationToDelegation1625529796779
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'delegation_id',
        type: 'varchar',
        isNullable: false,
      }),
    );
    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        name: 'user_delegation',
        columnNames: ['delegation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'delegation',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('user', 'user_delegation');
    await queryRunner.dropColumn('user', 'delegation_id');
  }
}
