import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { TicketsModule } from './tickets/tickets.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { TicketCustomFieldValue } from './tickets/entities/ticket-custom-field-value.entity';
import { Ticket } from './tickets/entities/ticket.entity';
import { Category } from './categories/entities/category.entity';
import { CustomField } from './categories/entities/custom-field.entity';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
// ... aquí van tus importaciones de configuración de TypeORM

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', '123456789'),
        database: configService.get<string>('DB_DATABASE', 'servicedesk_one'),
        entities: [
          __dirname + '/**/*.entity{.ts,.js}',
        ],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
        ssl: configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
        // Configuración adicional para mejor manejo de conexiones
        retryAttempts: 5,
        retryDelay: 3000,
        keepConnectionAlive: true,
        // Configuración de pool de conexiones
        extra: {
          connectionTimeoutMillis: 10000,
          idleTimeoutMillis: 30000,
          max: 20,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      // Aquí puedes listar las entidades que usarás en el módulo raíz si es necesarioUser
      User,
      TicketCustomFieldValue,
      Ticket,
      Category,
      CustomField
    ]),
    CategoriesModule,
    TicketsModule,
    DashboardModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}