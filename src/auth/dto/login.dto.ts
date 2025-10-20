import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'admin',
    description: 'Nombre de usuario',
  })
  @IsNotEmpty({ message: 'El username es requerido' })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'admin123',
    description: 'Contraseña del usuario',
  })
  @IsNotEmpty({ message: 'El password es requerido' })
  @IsString()
  password: string;
}
