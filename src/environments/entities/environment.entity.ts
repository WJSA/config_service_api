import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  //OneToMany,
} from 'typeorm';
//import { Variable } from '../../variables/entities/variable.entity';

@Entity('environments')
export class Environment {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  //@OneToMany(() => Variable, (variable) => variable.environment, {
  //  cascade: true,
  //})
  //variables: Variable[];
}
