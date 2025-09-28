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
import * as bcrypt from 'bcrypt';
import { Ticket } from './tickets/entities/ticket.entity';

async function bootstrap() {
  // Creamos una aplicación NestJS standalone, sin levantar un servidor HTTP
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('Starting the seeding process...');

  // Obtenemos los repositorios que vamos a necesitar
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const categoryRepository = app.get<Repository<Category>>(
    getRepositoryToken(Category),
  );
  const ticketRepository = app.get<Repository<Ticket>>(
    getRepositoryToken(Ticket),
  );
  try {
    // --- Limpieza de Tablas ---
    // Para que el script se pueda correr varias veces sin duplicar datos
    console.log('Cleaning old data...');
    await ticketRepository.query(
      'TRUNCATE "ticket_history" RESTART IDENTITY CASCADE;',
    );
    await ticketRepository.query(
      'TRUNCATE "ticket_custom_field_values" RESTART IDENTITY CASCADE;',
    );
    await ticketRepository.query(
      'TRUNCATE "tickets" RESTART IDENTITY CASCADE;',
    );
    await categoryRepository.query(
      'TRUNCATE "categories" RESTART IDENTITY CASCADE;',
    );
    await userRepository.query('TRUNCATE "users" RESTART IDENTITY CASCADE;');

    // --- 1. Creación de Usuarios ---
    // Creamos un usuario para cada rol definido en el negocio
    console.log('Seeding users...');
    const users = await userRepository.save([
      {
        name: 'Ana Gómez (Requester)',
        email: 'ana.gomez@empresa.com',
        role: UserRole.REQUESTER,
        password: 'password123', // <-- Contraseña añadida
      },
      {
        name: 'Carlos Ruiz (Agent)',
        email: 'carlos.ruiz@empresa.com',
        role: UserRole.AGENT,
        password: 'password123', // <-- Contraseña añadida
      },
      {
        name: 'María Rodríguez (Manager)',
        email: 'maria.rodriguez@empresa.com',
        role: UserRole.MANAGER,
        password: 'password123', // <-- Contraseña añadida
      },
    ]);
    console.log(`${users.length} users seeded successfully.`);

    // --- 2. Creación de Categorías y Campos Personalizados ---
    // Creamos categorías realistas para una empresa de software [cite: 4]
    console.log('Seeding categories and custom fields...');
    const categories = await categoryRepository.save([
      {
        name: 'Acceso a Repositorio GitHub',
        sla_first_response_hours: 2,
        sla_resolution_hours: 8,
        customFields: [
          {
            label: 'Nombre del Repositorio',
            type: FieldType.TEXT,
            is_required: true,
          },
        ] as CustomField[],
      },
      {
        name: 'Falla en Pipeline de CI/CD',
        sla_first_response_hours: 1,
        sla_resolution_hours: 12,
        customFields: [
          {
            label: 'URL del Pipeline afectado',
            type: FieldType.TEXT,
            is_required: true,
          },
          {
            label: 'Log de Error',
            type: FieldType.TEXTAREA,
            is_required: false,
          },
        ] as CustomField[],
      },
      {
        name: 'Alta de Cuenta (SaaS)',
        sla_first_response_hours: 8,
        sla_resolution_hours: 48,
        customFields: [
          { label: 'Nombre del SaaS', type: FieldType.TEXT, is_required: true },
          {
            label: 'Email del Usuario a crear',
            type: FieldType.TEXT,
            is_required: true,
          },
        ] as CustomField[],
      },
      {
        name: 'Problema con Entorno de Desarrollo',
        sla_first_response_hours: 4,
        sla_resolution_hours: 24,
        customFields: [
          {
            label: 'Nombre del Entorno (e.g., dev-user-1)',
            type: FieldType.TEXT,
            is_required: true,
          },
        ] as CustomField[],
      },
    ]);
    console.log(`${categories.length} categories seeded successfully.`);

    console.log('Seeding finished successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    // Cerramos la conexión de la aplicación
    await app.close();
  }
}

bootstrap();
