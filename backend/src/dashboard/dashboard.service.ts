import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, In } from 'typeorm';
import { Ticket, TicketStatus } from '../tickets/entities/ticket.entity';
import {
  TicketHistory,
  ActionType,
} from '../tickets/entities/ticket-history.entity';
import { subDays } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketHistory)
    private readonly ticketHistoryRepository: Repository<TicketHistory>,
  ) {}

  async getKpis() {
    const openTickets = await this.calculateOpenTickets();
    const ticketsInLast7Days = await this.calculateTicketsInLast7Days();
    const slaCompliancePercentage =
      await this.calculateSlaCompliancePercentage();

    return {
      openTickets,
      ticketsInLast7Days,
      slaCompliancePercentage,
    };
  }

  private async calculateOpenTickets(): Promise<number> {
    return this.ticketRepository.count({
      where: {
        status: In([TicketStatus.OPEN, TicketStatus.IN_PROGRESS]),
      },
    });
  }

  private async calculateTicketsInLast7Days(): Promise<number> {
    const sevenDaysAgo = subDays(new Date(), 7);
    return this.ticketRepository.count({
      where: {
        created_at: MoreThan(sevenDaysAgo),
      },
    });
  }

  private async calculateSlaCompliancePercentage(): Promise<number> {
    try {
      // 1. Obtener todos los tickets que han sido resueltos o cerrados
      console.log("🚀 ~ DashboardService ~ calculateSlaCompliancePercentage ~ resolvedTickets:")
      const resolvedTickets = await this.ticketRepository.find({
        where: {
          status: In([TicketStatus.RESOLVED, TicketStatus.CLOSED]),
        },
      });
      console.log("🚀 ~ DashboardService ~ calculateSlaCompliancePercentage ~ resolvedTickets:", resolvedTickets)

      if (resolvedTickets.length === 0) {
        return 100; // Si no hay tickets resueltos, el cumplimiento es del 100%
      }

      const resolvedTicketIds = resolvedTickets.map((ticket) => ticket.id);

      // 2. Obtener el historial de cuándo se marcaron como "resolved"
      const resolutionEvents = await this.ticketHistoryRepository.find({
        relations: ['ticket'],
        where: {
          ticket: In(resolvedTicketIds),
          action: ActionType.STATUS_CHANGE,
          new_value: TicketStatus.RESOLVED,
        },
        order: { created_at: 'ASC' }, // importante para obtener el primer evento
      });

      // Creamos un mapa para buscar fácilmente la fecha de resolución de cada ticket
      const resolutionDateMap = new Map<string, Date>();
      console.log("🚀 ~ DashboardService ~ calculateSlaCompliancePercentage ~ resolutionDateMap:", resolutionDateMap)
      for (const event of resolutionEvents) {
        console.log("🚀 ~ DashboardService ~ calculateSlaCompliancePercentage ~ event:", event)
        const ticketId = event.ticket.id;
        if (!resolutionDateMap.has(ticketId)) {
          resolutionDateMap.set(ticketId, event.created_at);
        }
      }
      console.log("🚀 ~ ----------------------------------------------------------")

      // 3. Contar cuántos cumplieron el SLA
      let compliantCount = 0;
      for (const ticket of resolvedTickets) {
        const resolutionDate = resolutionDateMap.get(ticket.id);
        if (resolutionDate) {
          if (
            new Date(resolutionDate) <= new Date(ticket.sla_resolution_target)
          ) {
            compliantCount++;
          }
        }
      }

      // 4. Calcular el porcentaje
      return (compliantCount / resolvedTickets.length) * 100;
    } catch (error) {
      console.log("🚀 ~ DashboardService ~ calculateSlaCompliancePercentage ~ error:", error)
      throw new Error('Error calculating SLA compliance percentage', error);
    }
  }
}
