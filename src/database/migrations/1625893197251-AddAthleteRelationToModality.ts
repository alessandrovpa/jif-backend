import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class AddAthleteRelationToModality1625893197251
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'athlete_modalities_modality',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isNullable: false,
            generationStrategy: 'increment',
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
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'athlete_modalities_modality',
      new TableForeignKey({
        name: 'athlete_modalities_athlete',
        columnNames: ['athlete_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'athlete',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'athlete_modalities_modality',
      new TableForeignKey({
        name: 'athlete_modalities_modality',
        columnNames: ['modality_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'modality',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'athlete_modalities_modality',
      'athlete_modalities_athlete',
    );
    await queryRunner.dropForeignKey(
      'athlete_modalities_modality',
      'athlete_modalities_modality',
    );
    await queryRunner.dropTable('athlete_modalities_modality');
  }
}
