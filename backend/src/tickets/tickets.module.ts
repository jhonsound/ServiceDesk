import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { TicketCustomFieldValue } from './entities/ticket-custom-field-value.entity';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      TicketCustomFieldValue,
      Category, // Importamos Category para poder buscarla
      User,     // Importamos User para poder buscarlo
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}