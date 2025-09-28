import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../tickets/entities/ticket.entity';
import { TicketHistory } from '../tickets/entities/ticket-history.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketHistory])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}