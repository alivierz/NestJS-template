import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    // 1. Cargamos las variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // 2. Conexión asíncrona a MongoDB usando ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DB_NAME'),
        connectionFactory: (connection) => {
          const logger = new Logger('MongoDB');
          const blue = (text: string) => `\x1b[34m${text}\x1b[0m`;

          // Si ya está conectado en este instante, lanzamos el log de una vez
          if (connection.readyState === 1) {
            logger.log(blue('Conexión establecida exitosamente con MongoDB'));
          }

          // Escuchamos eventos futuros (por si se cae y vuelve a conectar)
          connection.on('connected', () => {
            logger.log(blue('Conexión establecida exitosamente con MongoDB'));
          });

          connection.on('error', (error: any) => {
            logger.error(`Error en la conexión de MongoDB: ${error.message}`);
          });

          return connection;
        },
      }),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'tu_llave_secreta',
      // signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, //? lo aplico a todas las rutas
    },
  ],
})
export class AppModule {}
