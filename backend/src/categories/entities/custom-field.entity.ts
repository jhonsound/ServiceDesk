import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Category } from './category.entity';

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
}

@Entity({ name: 'custom_fields' })
export class CustomField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @Column({
    type: 'enum',
    enum: FieldType,
    default: FieldType.TEXT,
  })
  type: FieldType;

  @Column()
  is_required: boolean;

  @ManyToOne(() => Category, (category) => category.customFields)
  category: Category;
}