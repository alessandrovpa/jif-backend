import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAthlete1625881438141 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'athlete',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isNullable: false,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'birth',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'identity',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'genre',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'contact',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'picture',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'document',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'document_back',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'authorization',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'nickname',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'game_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'integer',
            default: 0,
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
    await queryRunner.dropTable('athlete');
  }
}
