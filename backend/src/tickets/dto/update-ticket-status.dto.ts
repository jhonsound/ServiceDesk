// src/tickets/dto/update-ticket-status.dto.ts

import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { TicketStatus } from '../entities/ticket.entity';

export class UpdateTicketStatusDto {
  @IsEnum(TicketStatus)
  @IsNotEmpty()
  newStatus: TicketStatus;

  @IsNumber()
  @IsNotEmpty()
  version: number;
}