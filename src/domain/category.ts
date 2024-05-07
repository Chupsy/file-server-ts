import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm';

@Entity('categories')
@Unique(['name'])
export default class Category {
  constructor(params: CategoryData | undefined) {
    if (params) {
      this.id = params.id;
      this.name = params.name;
      this.createdAt = params.createdAt;
      this.updatedAt = params.updatedAt;
    } else {
      this.name = '';
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

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

interface CategoryData {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
