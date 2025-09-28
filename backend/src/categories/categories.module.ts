import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { CustomField } from './entities/custom-field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CustomField])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}