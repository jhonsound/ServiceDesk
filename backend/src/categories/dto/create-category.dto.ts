
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsArray,
  ValidateNested,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FieldType } from '../entities/custom-field.entity';

class CreateCustomFieldDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsEnum(FieldType)
  @IsNotEmpty()
  type: FieldType;

  @IsBoolean()
  is_required: boolean;
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;


  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  sla_first_response_hours: number;

  @IsInt()
  @Min(1)
  sla_resolution_hours: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCustomFieldDto)
  customFields: CreateCustomFieldDto[];
}
