import { Exclude } from 'class-transformer';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

  @Column()
  @Exclude() // <-- Excluir este campo de las respuestas JSON
  password: string;

  // Hook para hashear la contraseña antes de guardar
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.REQUESTER,
  })
  role: UserRole;

  @OneToMany(() => Ticket, (ticket) => ticket.requester)
  tickets: Ticket[];


}
