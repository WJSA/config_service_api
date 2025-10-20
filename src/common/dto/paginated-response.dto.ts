export class PaginatedResponseDto<T> {
  count: number;
  next: string | null;
  previous: string | null;
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
