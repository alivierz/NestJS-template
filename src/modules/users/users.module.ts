import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/controllers/users.controller';
import { UsersService } from './application/users.service';
import { UserRepository } from './domain/ports/user-repository.port';
import { MongoUserRepository } from './infrastructure/persistence/mongo-user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserMongo,
  UserSchema,
} from './infrastructure/entities/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserMongo.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UserRepository,
      useClass: MongoUserRepository,
    },
  ],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
