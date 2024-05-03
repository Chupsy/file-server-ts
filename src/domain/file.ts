import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('files')
export default class File {
  constructor(params: FileData | undefined) {
    if (params) {
      this.id = params.id;
      this.filename = params.filename;
      this.data = params.data;
      this.mimeType = params.mimeType;
      this.createdAt = params.createdAt;
      this.updatedAt = params.updatedAt;
    } else {
      this.filename = '';
    }
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  filename: string;

  data?: Buffer;

  @Column()
  mimeType?: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}

interface FileData {
  id?: number;
  filename: string;
  data?: Buffer;
  mimeType?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
