// src/tickets/tickets.controller.ts

import { Controller, Post, Body, Get, Param, Patch, NotFoundException, UseGuards, Req, Delete } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
// ¡Importante! En un proyecto real, el usuario vendría de un decorador de autenticación.
// Para esta prueba, lo obtendremos del servicio.
import { User, UserRole } from '../users/entities/user.entity'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ) {
    const currentUser = req.user as User;
    return this.ticketsService.addComment(id, createCommentDto, currentUser);
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body() updateTicketStatusDto: UpdateTicketStatusDto,
    @Req() req: any,
  ) {
    // En una app real, esto sería @CurrentUser() currentUser: User
    // Para la prueba, simularemos que un 'Agent' hace el cambio
    const currentUser = req.user as User;
    if (!currentUser) throw new NotFoundException(`user with not found`);
    return this.ticketsService.changeStatus(id, updateTicketStatusDto, currentUser);
  }

  @Delete()
  removeMultiple(@Body('ids') ids: string[]) {
    return this.ticketsService.removeMultiple(ids);
  }
}