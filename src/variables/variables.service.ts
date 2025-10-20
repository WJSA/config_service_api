import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVariableDto } from './dto/create-variable.dto';
import { UpdateVariableDto } from './dto/update-variable.dto';
import { Variable } from './entities/variable.entity';
import { EnvironmentsService } from '../environments/environments.service';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class VariablesService {
  constructor(
    @InjectRepository(Variable)
    private readonly variableRepository: Repository<Variable>,
    private readonly environmentsService: EnvironmentsService,
  ) {}

  /**
   * Crear una nueva variable en un entorno
   */
  async create(
    envName: string,
    createVariableDto: CreateVariableDto,
  ): Promise<Variable> {
    // Verificar que el entorno exista
    await this.environmentsService.findOne(envName);

    // Verificar que no exista ya una variable con ese nombre en el entorno
    const existingVariable = await this.variableRepository.findOne({
      where: {
        name: createVariableDto.name,
        environment_name: envName,
      },
    });

    if (existingVariable) {
      throw new ConflictException(
        `La variable '${createVariableDto.name}' ya existe en el entorno '${envName}'`,
      );
    }

    const variable = this.variableRepository.create({
      ...createVariableDto,
      environment_name: envName,
    });

    return await this.variableRepository.save(variable);
  }

  /**
   * Listar todas las variables de un entorno con paginación
   */
  async findAll(
    envName: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponseDto<Variable>> {
    // Verificar que el entorno exista
    await this.environmentsService.findOne(envName);

    const [data, total] = await this.variableRepository.findAndCount({
      where: { environment_name: envName },
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return new PaginatedResponseDto(
      data,
      total,
      page,
      limit,
      `/environments/${envName}/variables`,
    );
  }

  /**
   * Obtener una variable específica de un entorno
   */
  async findOne(envName: string, varName: string): Promise<Variable> {
    const variable = await this.variableRepository.findOne({
      where: {
        name: varName,
        environment_name: envName,
      },
    });

    if (!variable) {
      throw new NotFoundException(
        `Variable '${varName}' no encontrada en el entorno '${envName}'`,
      );
    }

    return variable;
  }

  /**
   * Actualizar una variable (PUT - completo)
   */
  async update(
    envName: string,
    varName: string,
    updateVariableDto: UpdateVariableDto,
  ): Promise<Variable> {
    const variable = await this.findOne(envName, varName);

    // Si se está cambiando el nombre, verificar que no exista otra con ese nombre
    if (updateVariableDto.name && updateVariableDto.name !== varName) {
      const existingVariable = await this.variableRepository.findOne({
        where: {
          name: updateVariableDto.name,
          environment_name: envName,
        },
      });

      if (existingVariable) {
        throw new ConflictException(
          `La variable '${updateVariableDto.name}' ya existe en el entorno '${envName}'`,
        );
      }
    }

    Object.assign(variable, updateVariableDto);
    return await this.variableRepository.save(variable);
  }

  /**
   * Actualizar parcialmente una variable (PATCH - parcial)
   */
  async updatePartial(
    envName: string,
    varName: string,
    updateVariableDto: UpdateVariableDto,
  ): Promise<Variable> {
    return this.update(envName, varName, updateVariableDto);
  }

  /**
   * Eliminar una variable
   */
  async remove(envName: string, varName: string): Promise<void> {
    const variable = await this.findOne(envName, varName);
    await this.variableRepository.remove(variable);
  }

  /**
   * Obtener todas las variables de un entorno como objeto plano
   * Para el endpoint de consumo masivo
   */
  async getAllAsJson(envName: string): Promise<Record<string, string>> {
    // Verificar que el entorno exista
    await this.environmentsService.findOne(envName);

    const variables = await this.variableRepository.find({
      where: { environment_name: envName },
    });

    // Convertir array de variables a objeto plano { KEY: "value" }
    return variables.reduce(
      (acc, variable) => {
        acc[variable.name] = variable.value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }
}
