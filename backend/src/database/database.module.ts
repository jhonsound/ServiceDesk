
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true, // En producción, considera usar migraciones
        ssl: configService.get('DATABASE_URL').includes('render.com') 
             ? { rejectUnauthorized: false } 
             : false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
