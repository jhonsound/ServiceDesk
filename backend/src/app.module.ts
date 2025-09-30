import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { TicketsModule } from './tickets/tickets.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigModule esté disponible en toda la aplicación
    }),
    DatabaseModule, // Importa el módulo de base de datos centralizado
    CategoriesModule,
    TicketsModule,
    DashboardModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
