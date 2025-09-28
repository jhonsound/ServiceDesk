// src/tickets/entities/ticket-history.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from '../../users/entities/user.entity';

export enum ActionType {
  TICKET_CREATED = 'ticket_created',
  STATUS_CHANGE = 'status_change',
  COMMENT_ADDED = 'comment_added',
}

@Entity({ name: 'ticket_history' })
export class TicketHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ActionType,
  })
  action: ActionType;

  @Column({ type: 'text', nullable: true })
  old_value: string;

  @Column({ type: 'text', nullable: true })
  new_value: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Ticket, (ticket) => ticket.history)
  ticket: Ticket;

  @ManyToOne(() => User, { eager: true }) // eager para cargar siempre el usuario
  user: User;
}