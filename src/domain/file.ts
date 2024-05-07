import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import Category from './category';

@Entity('files')
export default class File {
  constructor(params: FileData | undefined) {
    if (params) {
      this.id = params.id;
      this.filename = params.filename;
      this.categories = params.categories;
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

  @ManyToMany(() => Category)
  @JoinTable()
  categories?: Category[];

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
  categories?: Category[];
  data?: Buffer;
  mimeType?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
