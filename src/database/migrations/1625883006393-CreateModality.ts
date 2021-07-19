import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateModality1625883006393 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'modality',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isNullable: false,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'genre',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'holder',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'backup',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('modality');
  }
}
