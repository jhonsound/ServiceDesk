import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Category } from '../categories/entities/category.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { TicketCustomFieldValue } from './entities/ticket-custom-field-value.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    return this.ticketRepository.save(newTicket);
  }
}
