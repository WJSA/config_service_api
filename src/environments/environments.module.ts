import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentsService } from './environments.service';
import { EnvironmentsController } from './environments.controller';
import { Environment } from './entities/environment.entity';
//import { VariablesModule } from '../variables/variables.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Environment]),
    //forwardRef(() => VariablesModule),
  ],
  controllers: [EnvironmentsController],
  providers: [EnvironmentsService],
  exports: [EnvironmentsService, TypeOrmModule],
})
export class EnvironmentsModule {}
