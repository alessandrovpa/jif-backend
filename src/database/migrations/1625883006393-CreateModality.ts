import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateModality1625883006393 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'modality',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isNullable: false,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
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
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('modality');
  }
}
