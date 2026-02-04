import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';

import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from 'src/common/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/common/dto/login-user.dto';
import { ErrorFactory } from 'src/common/exceptions/error.factory';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocs } from 'src/common/decorators/api-docs.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiDocs({
    summary: 'login de usuario',
    description: 'Endpoint para el login de usuarios registrados',
    body: LoginUserDto,
    isPublic: true,
    successResponse: {
      status: 200,
      description: 'Usuario encontrado',
      model: {
        username: 'prueba',
        email: 'prueba@gmail.com',
        role: 'user',
      },
    },
    errorResponses: [
      {
        status: 400,
        description: 'Cuando el usuario no existe en la DB',
        tracking: 'EXAMPLECODE001',
        message: 'Usuario no encontrado',
      },
    ],
  })
  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const USER = await this.authService.verifyUserExist(body.username);

    if (!USER || !USER.id) {
      throw ErrorFactory.controlError('Usuario no encontrado', 'AUTHCE0003');
    }

    const isMatch = await bcrypt.compare(body.password, USER.password);

    if (!isMatch) {
      throw ErrorFactory.controlError('Clave incorrecta', 'AUTHCE0004');
    }

    const TOKEN = await this.authService.signIn(body.username, USER.id);

    return {
      data: {
        username: USER.username,
        email: USER.email,
        role: USER.role,
      },
      message: 'Login successful',
      tracking: 'AUTHR0001',
      token: TOKEN,
    };
  }

  @Public()
  @ApiDocs({
    summary: 'registro de usuario',
    description: 'Endpoint para el registro de nuevos usuarios',
    body: CreateUserDto,
    isPublic: true,
    successResponse: {
      status: 200,
      description: 'Usuario registrado exitosamente',
      model: {
        username: 'prueba',
        email: 'prueba@gmail.com',
        password: '12345678',
      },
    },
    errorResponses: [
      {
        status: 400,
        description: 'Cuando el usuario ya existe en la DB',
        tracking: 'EXAMPLECODE001',
        message: 'Usuario ya registrado',
      },
    ],
  })
  @Post('register')
  async Register(@Body() body: CreateUserDto) {
    const salt = await bcrypt.genSalt(
      +(process.env.SALT_ROUNDS as unknown as number),
    );
    const passwordHash = await bcrypt.hash(body.password, salt);

    await this.authService.register(body.username, body.email, passwordHash);
    return {
      data: true,
      message: 'Register successful',
      tracking: 'AUTHR0002',
    };
  }
}
