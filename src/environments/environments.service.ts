import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { Environment } from './entities/environment.entity';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class EnvironmentsService {
  constructor(
    @InjectRepository(Environment)
    private readonly environmentRepository: Repository<Environment>,
  ) {}

  /**
   * Crear un nuevo entorno
   */
  async create(
    createEnvironmentDto: CreateEnvironmentDto,
  ): Promise<Environment> {
    // Verificar si ya existe un entorno con ese nombre
    const existingEnvironment = await this.environmentRepository.findOne({
      where: { name: createEnvironmentDto.name },
    });

    if (existingEnvironment) {
      throw new ConflictException(
        `El entorno con nombre '${createEnvironmentDto.name}' ya existe`,
      );
    }

    const environment = this.environmentRepository.create(createEnvironmentDto);
    return await this.environmentRepository.save(environment);
  }

  /**
   * Listar todos los entornos con paginación
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponseDto<Environment>> {
    const [data, total] = await this.environmentRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return new PaginatedResponseDto(
      data,
      total,
      page,
      limit,
      '/api/v1/environments',
    );
  }

  /**
   * Obtener un entorno por nombre
   */
  async findOne(name: string): Promise<Environment> {
    const environment = await this.environmentRepository.findOne({
      where: { name },
    });

    if (!environment) {
      throw new NotFoundException(`Entorno '${name}' no encontrado`);
    }

    return environment;
  }

  /**
   * Actualizar un entorno (PUT - completo)
   */
  async update(
    name: string,
    updateEnvironmentDto: UpdateEnvironmentDto,
  ): Promise<Environment> {
    const environment = await this.findOne(name);

    // Si se está cambiando el nombre, verificar que no exista otro con ese nombre
    if (updateEnvironmentDto.name && updateEnvironmentDto.name !== name) {
      const existingEnvironment = await this.environmentRepository.findOne({
        where: { name: updateEnvironmentDto.name },
      });

      if (existingEnvironment) {
        throw new ConflictException(
          `El entorno con nombre '${updateEnvironmentDto.name}' ya existe`,
        );
      }
    }

    Object.assign(environment, updateEnvironmentDto);
    return await this.environmentRepository.save(environment);
  }

  /**
   * Actualizar parcialmente un entorno (PATCH - parcial)
   */
  async updatePartial(
    name: string,
    updateEnvironmentDto: UpdateEnvironmentDto,
  ): Promise<Environment> {
    // PATCH reutiliza la misma lógica que PUT
    return this.update(name, updateEnvironmentDto);
  }

  /**
   * Eliminar un entorno
   */
  async remove(name: string): Promise<void> {
    const environment = await this.findOne(name);
    await this.environmentRepository.remove(environment);
  }
}
