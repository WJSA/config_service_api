import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Variable } from '../../variables/entities/variable.entity';

@Entity('environments')
export class Environment {
  @ApiProperty({
    description: 'Nombre único del entorno',
    example: 'dev',
  })
  @PrimaryColumn({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    description: 'Descripción del entorno',
    example: 'Entorno de desarrollo',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

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

  @OneToMany(() => Variable, (variable) => variable.environment, {
    cascade: true,
  })
  variables: Variable[];
}
