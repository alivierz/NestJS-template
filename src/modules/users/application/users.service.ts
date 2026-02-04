import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/ports/user-repository.port';
import { User } from '../domain/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(username: string, email: string, password: string) {
    return this.userRepository.create({
      username,
      email,
      password: password,
      role: 'user',
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByName(username);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
