import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Environment } from '../../environments/entities/environment.entity';

@Entity('variables')
export class Variable {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  name: string;

  @PrimaryColumn({ type: 'varchar', length: 100 })
  environment_name: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  is_sensitive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Environment, (environment) => environment.variables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'environment_name', referencedColumnName: 'name' })
  environment: Environment;
}
