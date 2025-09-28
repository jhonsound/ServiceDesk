import { Ticket } from '../../tickets/entities/ticket.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CustomField } from './custom-field.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  sla_first_response_hours: number;

  @Column()
  sla_resolution_hours: number;

  @OneToMany(() => CustomField, (customField) => customField.category, {
    cascade: true, // Si se crea una categoría, también sus campos
    eager: true, // Carga automáticamente los campos al buscar una categoría
  })
  customFields: CustomField[];

  @OneToMany(() => Ticket, (ticket) => ticket.category)
  tickets: Ticket[];
}