import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { TicketCustomFieldValue } from './entities/ticket-custom-field-value.entity';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { TicketHistory } from './entities/ticket-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      TicketCustomFieldValue,
      Category, 
      User,     
      TicketHistory
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}