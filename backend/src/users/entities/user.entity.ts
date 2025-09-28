import { Ticket } from '../../tickets/entities/ticket.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export enum UserRole {
  REQUESTER = 'requester',
  AGENT = 'agent',
  MANAGER = 'manager',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.REQUESTER,
  })
  role: UserRole;

  @OneToMany(() => Ticket, (ticket) => ticket.requester)
  tickets: Ticket[];
}
