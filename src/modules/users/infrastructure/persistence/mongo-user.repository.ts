import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../../domain/ports/user-repository.port';
import { User } from '../../domain/entities/user.entity';
import { UserDocument, UserMongo } from '../entities/schema/user.schema';

@Injectable()
export class MongoUserRepository implements UserRepository {
  private readonly logger = new Logger(MongoUserRepository.name);

  constructor(
    @InjectModel(UserMongo.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: User): Promise<User> {
    try {
      const createdUser = new this.userModel(user);
      const savedUser = await createdUser.save();
      return this.toEntity(savedUser); // Transformamos a Entidad de Dominio
    } catch (error) {
      this.logger.error(`Error creando usuario: ${error.message}`);
      throw error;
    }
  }

  async findByName(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username }).exec();
    return user ? this.toEntity(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel
      .findById(id, {
        password: 0, // Excluir el campo de contraseña
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
      })
      .exec();

    //? aqui no hace falta el mapeo porque ya estamos excluyendo los campos no deseados en la consulta
    return user;
  }

  // Mapeador privado para limpiar la respuesta y que ea un formato generico de entidad de dominio
  private toEntity(doc: UserDocument): User {
    return {
      id: doc._id.toString(), // Convertimos ObjectId a string
      username: doc.username,
      email: doc.email,
      role: doc.role,
      password: doc.password,
    };
  }
}
