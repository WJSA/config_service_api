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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { EnvironmentsService } from './environments.service';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { VariablesService } from '../variables/variables.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Environment } from './entities/environment.entity';

@ApiTags('Environments')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'environments', version: '1' })
@UseGuards(JwtAuthGuard)
export class EnvironmentsController {
  constructor(
    private readonly environmentsService: EnvironmentsService,
    private readonly variablesService: VariablesService,
  ) {}

  /**
   * POST /environments
   * Crear un nuevo entorno
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo entorno' })
  @ApiResponse({
    status: 201,
    description: 'Entorno creado exitosamente',
    type: Environment,
  })
  @ApiResponse({ status: 409, description: 'El entorno ya existe' })
  create(@Body() createEnvironmentDto: CreateEnvironmentDto) {
    return this.environmentsService.create(createEnvironmentDto);
  }

  /**
   * GET /environments
   * Listar todos los entornos con paginación
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos los entornos con paginación' })
  @ApiResponse({ status: 200, description: 'Lista paginada de entornos' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.environmentsService.findAll(
      paginationDto.page,
      paginationDto.limit,
    );
  }

  /**
   * GET /environments/:env_name.json
   * Consumo Masivo: Devuelve todas las variables del entorno como JSON plano
   * Este endpoint debe estar ANTES de :env_name para que coincida primero
   */
  @Get(':env_name.json')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener todas las variables como JSON plano (consumo masivo)',
  })
  @ApiResponse({
    status: 200,
    description: 'Objeto con todas las variables del entorno',
    schema: { example: { DB_URL: 'postgres://...', API_KEY: 'secret123' } },
  })
  @ApiResponse({ status: 404, description: 'Entorno no encontrado' })
  getEnvironmentJson(@Param('env_name') envName: string) {
    return this.variablesService.getAllAsJson(envName);
  }

  /**
   * GET /environments/:env_name
   * Obtener los detalles de un entorno específico
   */
  @Get(':env_name')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('env_name') envName: string) {
    return this.environmentsService.findOne(envName);
  }

  /**
   * PUT /environments/:env_name
   * Actualizar completamente un entorno
   */
  @Put(':env_name')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('env_name') envName: string,
    @Body() updateEnvironmentDto: UpdateEnvironmentDto,
  ) {
    return this.environmentsService.update(envName, updateEnvironmentDto);
  }

  /**
   * PATCH /environments/:env_name
   * Actualizar parcialmente un entorno
   */
  @Patch(':env_name')
  @HttpCode(HttpStatus.OK)
  updatePartial(
    @Param('env_name') envName: string,
    @Body() updateEnvironmentDto: UpdateEnvironmentDto,
  ) {
    return this.environmentsService.updatePartial(
      envName,
      updateEnvironmentDto,
    );
  }

  /**
   * DELETE /environments/:env_name
   * Eliminar un entorno
   */
  @Delete(':env_name')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('env_name') envName: string) {
    return this.environmentsService.remove(envName);
  }
}
