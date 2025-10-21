import { IsNotEmpty, IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnvironmentDto {
  @ApiProperty({
    description: 'Nombre único del entorno (slug válido)',
    example: 'dev',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'El nombre debe ser un slug válido (ej: dev, staging, prod-01)',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del entorno',
    example: 'Entorno de desarrollo',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un string' })
  description?: string;
}
