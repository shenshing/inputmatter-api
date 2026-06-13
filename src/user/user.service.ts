import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepo.findOneBy({ googleId });
  }

  findById(id: string): Promise<User | null> {
    return this.userRepo.findOneBy({ id });
  }

  create(data: {
    email: string;
    passwordHash?: string;
    googleId?: string;
    role?: UserRole;
  }): Promise<User> {
    const user = this.userRepo.create({
      email: data.email,
      passwordHash: data.passwordHash ?? null,
      googleId: data.googleId ?? null,
      role: data.role ?? 'shop-admin',
    });
    return this.userRepo.save(user);
  }
}
