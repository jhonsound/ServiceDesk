import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import {
  CustomField,
  FieldType,
} from './categories/entities/custom-field.entity';
import { Ticket, TicketStatus } from './tickets/entities/ticket.entity';
import { TicketCustomFieldValue } from './tickets/entities/ticket-custom-field-value.entity';
import { addHours } from 'date-fns';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('Iniciando el proceso de seeding...');

  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const categoryRepository = app.get<Repository<Category>>(
    getRepositoryToken(Category),
  );
  const ticketRepository = app.get<Repository<Ticket>>(
    getRepositoryToken(Ticket),
  );
  const customFieldValueRepository = app.get<Repository<TicketCustomFieldValue>>(
    getRepositoryToken(TicketCustomFieldValue),
  );
  const customFieldRepository = app.get<Repository<CustomField>>(
    getRepositoryToken(CustomField),
  );

  try {
    console.log('Limpiando datos antiguos...');
    // Con CASCADE, TypeORM se encarga de truncar las tablas dependientes.
    await userRepository.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;');
    await categoryRepository.query('TRUNCATE TABLE "categories" RESTART IDENTITY CASCADE;');


    console.log('Creando usuarios...');
    const users = await userRepository.save([
      {
        name: 'Ana Gómez (Solicitante)',
        email: 'ana.gomez@empresa.com',
        role: UserRole.REQUESTER,
        password: 'password123',
      },
      {
        name: 'Carlos Ruiz (Agente)',
        email: 'carlos.ruiz@empresa.com',
        role: UserRole.AGENT,
        password: 'password123',
      },
      {
        name: 'María Rodríguez (Manager)',
        email: 'maria.rodriguez@empresa.com',
        role: UserRole.MANAGER,
        password: 'password123',
      },
    ]);
    console.log(`${users.length} usuarios creados.`);
    const requester = users.find((u) => u.role === UserRole.REQUESTER);

    console.log('Creando categorías y campos personalizados...');
    const categoriesData = [
      {
        name: 'Acceso a Repositorio GitHub',
        description:
          'Solicitud para dar acceso de lectura/escritura a un repositorio.',
        sla_first_response_hours: 2,
        sla_resolution_hours: 8,
        customFields: [
          {
            label: 'Nombre del Repositorio',
            type: FieldType.TEXT,
            is_required: true,
          },
          {
            label: 'Permiso Requerido',
            type: FieldType.TEXT,
            is_required: true,
          },
        ],
      },
      {
        name: 'Falla en Pipeline de CI/CD',
        description:
          'Reporte de errores en los pipelines de integración continua.',
        sla_first_response_hours: 1,
        sla_resolution_hours: 12,
        customFields: [
          {
            label: 'URL del Pipeline afectado',
            type: FieldType.TEXT,
            is_required: true,
          },
          { label: 'Log de Error', type: FieldType.TEXTAREA, is_required: false },
        ],
      },
      {
        name: 'Alta de Cuenta (SaaS)',
        description: 'Creación de nuevas cuentas en plataformas de terceros.',
        sla_first_response_hours: 8,
        sla_resolution_hours: 48,
        customFields: [
          { label: 'Nombre del SaaS', type: FieldType.TEXT, is_required: true },
          {
            label: 'Email del Usuario a crear',
            type: FieldType.TEXT,
            is_required: true,
          },
        ],
      },
    ];

    const categories = await categoryRepository.save(categoriesData);
    console.log(`${categories.length} categorías creadas.`);

    console.log('Creando tickets de prueba...');
    const now = new Date();
    const githubCategory = categories.find(c => c.name === 'Acceso a Repositorio GitHub');

    if (githubCategory && requester) {
      const ticket1 = await ticketRepository.save({
        title: 'Acceso a repositorio "ServiceDesk-Frontend"',
        description: 'Necesito acceso de escritura para poder subir mis cambios.',
        status: TicketStatus.OPEN,
        requester: requester,
        category: githubCategory,
        category_name_snapshot: githubCategory.name,
        sla_first_response_target: addHours(now, githubCategory.sla_first_response_hours),
        sla_resolution_target: addHours(now, githubCategory.sla_resolution_hours),
      });

      const repoNameField = await customFieldRepository.findOne({ where: { label: 'Nombre del Repositorio', category: { id: githubCategory.id } } });
      const permissionField = await customFieldRepository.findOne({ where: { label: 'Permiso Requerido', category: { id: githubCategory.id } } });

      if(repoNameField && permissionField) {
        await customFieldValueRepository.save([
          {
            ticket: ticket1,
            customField: repoNameField,
            value: 'ServiceDesk-Frontend',
          },
          {
            ticket: ticket1,
            customField: permissionField,
            value: 'Escritura (Write)',
          },
        ]);
      }
    }

    const pipelineCategory = categories.find(c => c.name === 'Falla en Pipeline de CI/CD');
    if (pipelineCategory && requester) {
      const ticket2 = await ticketRepository.save({
        title: 'El pipeline de despliegue a producción está fallando',
        description: 'Desde esta mañana, el pipeline que despliega a producción falla en el paso de "build". Adjunto logs.',
        status: TicketStatus.IN_PROGRESS,
        requester: requester,
        category: pipelineCategory,
        category_name_snapshot: pipelineCategory.name,
        sla_first_response_target: addHours(now, pipelineCategory.sla_first_response_hours),
        sla_resolution_target: addHours(now, pipelineCategory.sla_resolution_hours),
      });

      const urlField = await customFieldRepository.findOne({ where: { label: 'URL del Pipeline afectado', category: { id: pipelineCategory.id } } });
      if(urlField){
        await customFieldValueRepository.save({
            ticket: ticket2,
            customField: urlField,
            value: 'https://github.com/empresa/proyecto/actions/runs/12345',
        });
      }
    }

    console.log('Tickets de prueba creados.');
    console.log('Seeding finalizado con éxito!');
  } catch (error) {
    console.error('Error durante el seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();