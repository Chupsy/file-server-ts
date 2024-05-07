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
      this.category = params.category;
      this.mimeType = params.mimeType;
      this.createdAt = params.createdAt;
      this.updatedAt = params.updatedAt;
    } else {
      this.filename = '';
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  filename: string;

  @Column()
  mimeType?: string;

  @Column({
    nullable: true,
  })
  category?: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}

export class FileWithData extends File {
  data: Buffer | undefined;

  constructor(fileData: FileData) {
    super(fileData);
    this.data = fileData.data;
  }
}

interface FileData {
  id?: string;
  filename: string;
  category?: string;
  data?: Buffer;
  mimeType?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
