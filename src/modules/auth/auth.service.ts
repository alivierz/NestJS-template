import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser } from 'src/common/interfaces/jwt.interface';
import { ErrorFactory } from 'src/common/exceptions/error.factory';
import { User } from '../users/domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, id: string): Promise<string> {
    try {
      const payload: AuthenticatedUser = {
        id: id.toString(),
        email: username,
        role: process.env.DEFAULT_ROLE || 'user',
      };

      return await this.jwtService.signAsync(payload);
    } catch (error) {
      throw ErrorFactory.dbError(error, 'AUTHSE0001');
    }
  }

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    try {
      const user = await this.usersService.create(username, email, password);
      return user;
    } catch (error) {
      throw ErrorFactory.dbError(error, 'AUTHSE0002');
    }
  }

  async verifyUserExist(username: string): Promise<User | null> {
    const user = await this.usersService.getUserByUsername(username);

    return user;
  }
}
