import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VariablesService } from './variables.service';
import { CreateVariableDto } from './dto/create-variable.dto';
import { UpdateVariableDto } from './dto/update-variable.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Variables')
@ApiBearerAuth('JWT-auth')
@Controller('environments/:env_name/variables')
@UseGuards(JwtAuthGuard)
export class VariablesController {
  constructor(private readonly variablesService: VariablesService) {}

  /**
   * POST /environments/:env_name/variables
   * Crear una nueva variable en un entorno
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('env_name') envName: string,
    @Body() createVariableDto: CreateVariableDto,
  ) {
    return this.variablesService.create(envName, createVariableDto);
  }

  /**
   * GET /environments/:env_name/variables
   * Listar todas las variables de un entorno con paginación
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('env_name') envName: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.variablesService.findAll(
      envName,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  /**
   * GET /environments/:env_name/variables/:var_name
   * Obtener los detalles de una variable específica
   */
  @Get(':var_name')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('env_name') envName: string,
    @Param('var_name') varName: string,
  ) {
    return this.variablesService.findOne(envName, varName);
  }

  /**
   * PUT /environments/:env_name/variables/:var_name
   * Actualizar completamente una variable
   */
  @Put(':var_name')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('env_name') envName: string,
    @Param('var_name') varName: string,
    @Body() updateVariableDto: UpdateVariableDto,
  ) {
    return this.variablesService.update(envName, varName, updateVariableDto);
  }

  /**
   * PATCH /environments/:env_name/variables/:var_name
   * Actualizar parcialmente una variable
   */
  @Patch(':var_name')
  @HttpCode(HttpStatus.OK)
  updatePartial(
    @Param('env_name') envName: string,
    @Param('var_name') varName: string,
    @Body() updateVariableDto: UpdateVariableDto,
  ) {
    return this.variablesService.updatePartial(
      envName,
      varName,
      updateVariableDto,
    );
  }

  /**
   * DELETE /environments/:env_name/variables/:var_name
   * Eliminar una variable
   */
  @Delete(':var_name')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('env_name') envName: string,
    @Param('var_name') varName: string,
  ) {
    return this.variablesService.remove(envName, varName);
  }
}
