import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Environment } from '../../environments/entities/environment.entity';

@Entity('variables')
export class Variable {
  @ApiProperty({
    description: 'Nombre de la variable',
    example: 'DB_URL',
  })
  @PrimaryColumn({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    description: 'Nombre del entorno al que pertenece',
    example: 'dev',
  })
  @PrimaryColumn({ type: 'varchar', length: 100 })
  environment_name: string;

  @ApiProperty({
    description: 'Valor de la variable',
    example: 'postgres://user:pass@localhost:5432/mydb',
  })
  @Column({ type: 'text' })
  value: string;

  @ApiProperty({
    description: 'Descripción de la variable',
    example: 'URL de conexión a la base de datos',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Indica si es información sensible',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  is_sensitive: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-01-20T10:30:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-01-20T10:30:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Environment, (environment) => environment.variables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'environment_name', referencedColumnName: 'name' })
  environment: Environment;
}
