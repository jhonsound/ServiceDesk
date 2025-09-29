import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CustomField } from './entities/custom-field.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Busca todas las categorías con sus campos personalizados
  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { customFields, ...categoryData } = createCategoryDto;

    const category = this.categoryRepository.create({
      ...categoryData,
      customFields: customFields.map((fieldDto) => {
        const customField = new CustomField();
        customField.label = fieldDto.label;
        customField.type = fieldDto.type;
        customField.is_required = fieldDto.is_required;
        return customField;
      }),
    });

    return this.categoryRepository.save(category);
  }
}