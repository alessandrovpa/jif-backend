import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import Delegation from './Delegation';
import Modality from './Modality';

@Entity('athlete')
class Athlete {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  birth: Date;

  @Column()
  identity: string;

  @Column()
  genre: 'masculino' | 'feminino';

  @Column()
  contact: string;

  @Column()
  picture: string;

  @Column()
  document: string;

  @Column()
  document_back: string;

  @Column()
  authorization: string;

  @Column()
  nickname: string;

  @Column()
  game_id: string;

  @Column()
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  delegation_id: string;

  @OneToOne(() => Delegation)
  @JoinColumn({ name: 'delegation_id' })
  delegation: Delegation;

  @ManyToMany(type => Modality, modality => modality.athletes)
  @JoinTable()
  modalities: Modality[];
}

export default Athlete;
