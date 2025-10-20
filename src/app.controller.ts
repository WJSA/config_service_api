import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * GET /status
   * Health Check: Responde "pong"
   */
  @ApiTags('Health')
  @Get('status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Health Check del servicio' })
  @ApiResponse({
    status: 200,
    description: 'Servicio funcionando correctamente',
  })
  healthCheck(): string {
    return 'pong';
  }
}
