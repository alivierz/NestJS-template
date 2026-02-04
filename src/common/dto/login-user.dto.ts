import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'user',
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Clave de usuario',
    example: '12345678',
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}
