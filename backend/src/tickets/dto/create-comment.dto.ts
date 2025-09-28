import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'El comentario no puede estar vacío.' })
  @MinLength(5, { message: 'El comentario debe tener al menos 5 caracteres.' })
  comment: string;
}