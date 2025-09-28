import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  VersionColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { TicketCustomFieldValue } from './ticket-custom-field-value.entity';
import { TicketHistory } from './ticket-history.entity';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @VersionColumn() // <--- TypeORM manejará esto automáticamente
  version: number;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  sla_first_response_target: Date;

  @Column({ type: 'timestamp' })
  sla_resolution_target: Date;

  @Column()
  category_name_snapshot: string; // La "instantánea"

  @ManyToOne(() => User, (user) => user.tickets, { eager: true })
  requester: User;

  @ManyToOne(() => Category, (category) => category.tickets)
  category: Category;

  @OneToMany(() => TicketHistory, (history) => history.ticket, { cascade: true })
  history: TicketHistory[];

  @OneToMany(
    () => TicketCustomFieldValue,
    (fieldValue) => fieldValue.ticket,
    { cascade: true },
  )
  customFieldValues: TicketCustomFieldValue[];
}