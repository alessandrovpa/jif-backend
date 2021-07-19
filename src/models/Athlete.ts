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
import { Expose } from 'class-transformer';

import Delegation from './Delegation';
import Modality from './Modality';

@Entity('athlete')
class Athlete {
  @PrimaryGeneratedColumn('increment')
  id: number;

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
  @Expose({ name: 'picture_url' })
  getPictureUrl(): string | null {
    return this.picture
      ? `${process.env.API_URL}/files/athlete/picture/${this.picture}`
      : null;
  }

  @Column()
  document: string;
  @Expose({ name: 'document_url' })
  getDocumentUrl(): string | null {
    return this.document
      ? `${process.env.API_URL}/files/athlete/document/${this.document}`
      : null;
  }

  @Column()
  document_back: string;
  @Expose({ name: 'document_back_url' })
  getDocumentBackUrl(): string | null {
    return this.document_back
      ? `${process.env.API_URL}/files/athlete/document_back/${this.document_back}`
      : null;
  }

  @Column()
  authorization: string;
  @Expose({ name: 'authorization_url' })
  getAuthorizationUrl(): string | null {
    return this.authorization
      ? `${process.env.API_URL}/files/athlete/authorization/${this.authorization}`
      : null;
  }

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

  @Column()
  observation: string;
}

export default Athlete;
