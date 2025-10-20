import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  Matches,
} from 'class-validator';

export class CreateVariableDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Matches(/^[A-Z0-9_]+$/, {
    message:
      'El nombre debe ser un slug válido en mayúsculas (ej: DB_URL, API_KEY)',
  })
  name: string;

  @IsNotEmpty({ message: 'El valor es requerido' })
  @IsString({ message: 'El valor debe ser un string' })
  value: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un string' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'is_sensitive debe ser un booleano' })
  is_sensitive?: boolean;
}
