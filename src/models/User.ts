import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import Delegation from './Delegation';

@Entity('user')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  siape: string;

  @Column()
  password: string;

  @Column()
  contact: string;

  @Column()
  portaria: string;

  @Column()
  document: string;

  @Column()
  document_back: string;

  @Column()
  access: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  delegation_id: string;

  @OneToOne(() => Delegation)
  @JoinColumn({ name: 'delegation_id' })
  delegation: Delegation;
}

export default User;
