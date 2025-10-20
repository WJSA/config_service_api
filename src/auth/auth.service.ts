import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  username: string;
  sub: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Validar credenciales y generar token JWT
   */
  login(username: string, password: string): { access_token: string } {
    // Obtener credenciales desde variables de entorno
    const validUsername =
      this.configService.get<string>('AUTH_USERNAME') || 'admin';
    const validPassword =
      this.configService.get<string>('AUTH_PASSWORD') || 'admin123';

    // Validar credenciales
    if (username !== validUsername || password !== validPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar JWT con payload tipado
    const payload: JwtPayload = { username, sub: 1 };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
    };
  }
}
