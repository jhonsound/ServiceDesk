import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, OptimisticLockVersionMismatchError } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { Category } from '../categories/entities/category.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { TicketHistory, ActionType } from './entities/ticket-history.entity';
import { TicketCustomFieldValue } from './entities/ticket-custom-field-value.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TicketHistory) // <--- Añadir repositorio de historial
    private readonly ticketHistoryRepository: Repository<TicketHistory>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { title, description, categoryId, customFieldValues } =
      createTicketDto;

    // 1. Validar que la categoría y el usuario existan
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // --- Lógica de Negocio Clave ---
    // En un caso real, el ID del usuario vendría de la sesión de autenticación.
    // Para la prueba, asumiremos que existe un usuario y lo buscaremos.
    const requester = await this.userRepository.findOneBy({
      role: UserRole.REQUESTER,
    });
    if (!requester) {
      throw new NotFoundException(
        'No requester user found to assign the ticket.',
      );
    }

    const newTicket = this.ticketRepository.create({
      title,
      description,
      requester,
      category,
      category_name_snapshot: category.name, // 2. Guardamos la "instantánea" del nombre
    });

    // 3. Calculamos las fechas objetivo del SLA
    const now = new Date();
    newTicket.sla_first_response_target = new Date(
      now.getTime() + category.sla_first_response_hours * 60 * 60 * 1000,
    );
    newTicket.sla_resolution_target = new Date(
      now.getTime() + category.sla_resolution_hours * 60 * 60 * 1000,
    );

    // 4. Creamos y asociamos los valores de los campos personalizados
    newTicket.customFieldValues = customFieldValues.map((valueDto) => {
      const fieldValue = new TicketCustomFieldValue();
      fieldValue.customField = { id: valueDto.customFieldId } as any;
      fieldValue.value = valueDto.value;
      return fieldValue;
    });

    const savedTicket = await this.ticketRepository.save(newTicket);

    // --- Añadir registro de auditoría para la creación ---
    await this.createHistoryEntry(
      savedTicket,
      requester,
      ActionType.TICKET_CREATED,
    );

    return savedTicket;
  }

  async addComment(
    id: string,
    createCommentDto: CreateCommentDto,
    currentUser: User,
  ): Promise<TicketHistory> {
    const { comment } = createCommentDto;

    const ticket = await this.ticketRepository.findOneBy({ id });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    // Cualquier rol puede añadir comentarios según nuestra matriz de permisos
    const historyEntry = this.ticketHistoryRepository.create({
      ticket,
      user: currentUser,
      action: ActionType.COMMENT_ADDED,
      comment: comment,
    });

    return this.ticketHistoryRepository.save(historyEntry);
  }

  /**
   * Encuentra todos los tickets (para la vista de lista).
   */
  findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find({
      relations: ['requester', 'category'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Encuentra un ticket por su ID con su historial.
   */
  findOne(id: string): Promise<Ticket | null> {
    return this.ticketRepository.findOne({
      where: { id },
      relations: ['requester', 'category', 'history', 'history.user'],
    });
  }

  /**
   * Cambia el estado de un ticket, aplicando reglas de negocio.
   */
  async changeStatus(
    id: string,
    updateDto: UpdateTicketStatusDto,
    currentUser: User,
  ): Promise<Ticket> {
    const { newStatus, version } = updateDto;

    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['history', 'history.user'],
    });
    if (!ticket) throw new NotFoundException(`Ticket with ID ${id} not found`);

    // 1. Lógica de Permisos (simplificada)
    this.checkStatusChangePermission(
      ticket.status,
      newStatus,
      currentUser.role,
    );

    const oldStatus = ticket.status;
    ticket.status = newStatus;
    ticket.version = version; // Asignamos la versión que nos envía el cliente

    try {
      // 2. Lógica de Concurrencia (Bloqueo Optimista)
      const updatedTicket = await this.ticketRepository.save(ticket);

      // 3. Lógica de Auditoría
      await this.createHistoryEntry(
        updatedTicket,
        currentUser,
        ActionType.STATUS_CHANGE,
        oldStatus,
        newStatus,
      );

      return updatedTicket;
    } catch (error) {
      if (error instanceof OptimisticLockVersionMismatchError) {
        throw new ConflictException(
          'El ticket ha sido modificado por otra persona. Por favor, refresca la página.',
        );
      }
      throw error;
    }
  }

  /**
   * Helper privado para crear entradas en el historial.
   */
  private createHistoryEntry(
    ticket: Ticket,
    user: User,
    action: ActionType,
    old_value?: string,
    new_value?: string,
  ) {
    const historyEntry = this.ticketHistoryRepository.create({
      ticket,
      user,
      action,
      old_value,
      new_value,
    });
    return this.ticketHistoryRepository.save(historyEntry);
  }

  /**
   * Helper privado para validar las transiciones de estado.
   */
  private checkStatusChangePermission(
    from: TicketStatus,
    to: TicketStatus,
    role: UserRole,
  ) {
    const allowedTransitions = {
      [UserRole.AGENT]: {
        [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS],
        [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED],
        [TicketStatus.RESOLVED]: [TicketStatus.CLOSED],
      },
      [UserRole.REQUESTER]: {
        [TicketStatus.RESOLVED]: [
          TicketStatus.IN_PROGRESS,
          TicketStatus.CLOSED,
        ],
      },
      [UserRole.MANAGER]: {
        // El manager puede hacer todo
        [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS],
        [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED],
        [TicketStatus.RESOLVED]: [
          TicketStatus.IN_PROGRESS,
          TicketStatus.CLOSED,
        ],
      },
    };

    if (!allowedTransitions[role]?.[from]?.includes(to)) {
      throw new ForbiddenException(
        `Rol '${role}' no puede cambiar el estado de '${from}' a '${to}'.`,
      );
    }
  }
}
