import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Total de elementos',
    example: 50,
  })
  count: number;

  @ApiProperty({
    description: 'URL de la siguiente página',
    example: '/api/v1/environments?page=2&limit=10',
    nullable: true,
  })
  next: string | null;

  @ApiProperty({
    description: 'URL de la página anterior',
    example: '/api/v1/environments?page=1&limit=10',
    nullable: true,
  })
  previous: string | null;

  @ApiProperty({
    description: 'Array de resultados',
    isArray: true,
  })
  results: T[];

  constructor(
    data: T[],
    total: number,
    page: number,
    limit: number,
    baseUrl: string,
  ) {
    this.count = total;
    this.results = data;

    const totalPages = Math.ceil(total / limit);

    // Calcular URL del siguiente página
    this.next =
      page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null;

    // Calcular URL de la página anterior
    this.previous =
      page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null;
  }
}
