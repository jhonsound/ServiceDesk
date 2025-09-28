import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Ticket } from './ticket.entity';
import { CustomField } from '../../categories/entities/custom-field.entity';

@Entity({ name: 'ticket_custom_field_values' })
export class TicketCustomFieldValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  value: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.customFieldValues)
  ticket: Ticket;

  @ManyToOne(() => CustomField, { eager: true }) // eager para obtener info del campo
  customField: CustomField;
}