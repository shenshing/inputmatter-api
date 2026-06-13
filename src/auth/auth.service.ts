import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateLocalUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.passwordHash) return null;
    const match = await bcrypt.compare(password, user.passwordHash);
    return match ? user : null;
  }

  async register(dto: RegisterDto): Promise<{ access_token: string }> {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({ email: dto.email, passwordHash });
    return this.issueToken(user);
  }

  login(user: User): { access_token: string } {
    return this.issueToken(user);
  }

  async findOrCreateGoogleUser(email: string, googleId: string): Promise<User> {
    let user = await this.userService.findByGoogleId(googleId);
    if (!user) {
      user = await this.userService.findByEmail(email);
      if (!user) {
        user = await this.userService.create({ email, googleId });
      }
    }
    return user;
  }

  issueToken(user: User): { access_token: string } {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
