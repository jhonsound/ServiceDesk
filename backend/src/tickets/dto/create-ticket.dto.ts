import { IsString, IsUUID, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class CustomFieldValueDto {
  @IsUUID()
  @IsNotEmpty()
  customFieldId: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  // Asumiremos que el requesterId vendrá del usuario autenticado en un futuro
  // Por ahora lo puedes añadir aquí si quieres: @IsUUID() requesterId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomFieldValueDto)
  customFieldValues: CustomFieldValueDto[];
}