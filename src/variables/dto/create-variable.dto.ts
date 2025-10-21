import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVariableDto {
  @ApiProperty({
    description: 'Nombre de la variable (UPPER_SNAKE_CASE)',
    example: 'DB_URL',
    pattern: '^[A-Z0-9_]+$',
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Matches(/^[A-Z0-9_]+$/, {
    message:
      'El nombre debe ser un slug válido en mayúsculas (ej: DB_URL, API_KEY)',
  })
  name: string;

  @ApiProperty({
    description: 'Valor de la variable',
    example: 'postgres://user:pass@localhost:5432/mydb',
  })
  @IsNotEmpty({ message: 'El valor es requerido' })
  @IsString({ message: 'El valor debe ser un string' })
  value: string;

  @ApiProperty({
    description: 'Descripción de para qué sirve la variable',
    example: 'URL de conexión a la base de datos',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un string' })
  description?: string;

  @ApiProperty({
    description: 'Indica si la variable contiene información sensible',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'is_sensitive debe ser un booleano' })
  is_sensitive?: boolean;
}
