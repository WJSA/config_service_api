import { IsNotEmpty, IsString, IsOptional, Matches } from 'class-validator';

export class CreateEnvironmentDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'El nombre debe ser un slug válido (ej: dev, staging, prod-01)',
  })
  name: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un string' })
  description?: string;
}
