import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAthleteModality1625883401647 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'athlete_modality',
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
            name: 'athlete_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'modality_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'captain',
            type: 'boolean',
            default: false,
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

    await queryRunner.createForeignKey(
      'athlete_modality',
      new TableForeignKey({
        name: 'athlete_modality_athlete',
        columnNames: ['athlete_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'athlete',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'athlete_modality',
      new TableForeignKey({
        name: 'athlete_modality_modality',
        columnNames: ['modality_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'modality',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('athlete_modality');
    await queryRunner.dropForeignKey(
      'athlete_modality',
      'athlete_modality_athlete',
    );
    await queryRunner.dropForeignKey(
      'athlete_modality',
      'athlete_modality_modality',
    );
  }
}
