import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract findByName(username: string): Promise<User | null>;

  abstract create(user: User): Promise<User>;

  abstract findById(id: string): Promise<User | null>;
}
