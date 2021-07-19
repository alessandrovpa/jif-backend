import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import Delegation from './Delegation';

@Entity('user')
class User {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  siape: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  contact: string;

  @Column()
  portaria: string;
  @Expose({ name: 'portaria_url' })
  getPortariaUrl(): string | null {
    return this.portaria
      ? `${process.env.API_URL}/files/user/portaria/${this.portaria}`
      : null;
  }

  @Column()
  document: string;
  @Expose({ name: 'document_url' })
  getDocumentUrl(): string | null {
    return this.document
      ? `${process.env.API_URL}/files/user/document/${this.document}`
      : null;
  }

  @Column()
  document_back: string;
  @Expose({ name: 'document_back_url' })
  getDocumentBackUrl(): string | null {
    return this.document_back
      ? `${process.env.API_URL}/files/user/document_back/${this.document_back}`
      : null;
  }

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

  @Column()
  function: string;
}

export default User;
