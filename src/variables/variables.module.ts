import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariablesService } from './variables.service';
import { VariablesController } from './variables.controller';
import { Variable } from './entities/variable.entity';
import { EnvironmentsModule } from '../environments/environments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Variable]),
    forwardRef(() => EnvironmentsModule),
  ],
  controllers: [VariablesController],
  providers: [VariablesService],
  exports: [VariablesService],
})
export class VariablesModule {}
