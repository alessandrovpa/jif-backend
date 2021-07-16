import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import Athlete from './Athlete';

@Entity('modality')
class Modality {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  name: string;

  @Column()
  genre: 'masculino' | 'feminino' | 'misto';

  @Column()
  holder: number;

  @Column()
  backup: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(type => Athlete, athlete => athlete.modalities)
  athletes: Athlete[];
}

export default Modality;
