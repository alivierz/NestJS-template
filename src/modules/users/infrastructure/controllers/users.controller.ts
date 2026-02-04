import { ApiDocs } from 'src/common/decorators/api-docs.decorator';
import { UsersService } from './../../application/users.service';
import { Controller, Get, Req } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiDocs({
    summary: 'detalle de usuario',
    description: 'Endpoint para obtener los detalles de un usuario',
    isPublic: false,
    successResponse: {
      status: 200,
      description: 'Usuario encontrado exitosamente',
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
  @Get('detail')
  async getsrDetail(@Req() request: any) {
    console.log('Request user ID:', request.user);
    const usersService = await this.usersService.getUserById(request.user.id);

    return {
      data: usersService,
      message: 'Datos de usuario',
      tracking: 'USERR0001',
    };
  }
}
