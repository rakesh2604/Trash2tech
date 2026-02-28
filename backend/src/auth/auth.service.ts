import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const SALT_ROUNDS = 10;

/** Normalize DB role to API role (RECYCLER_USER -> RECYCLER, BRAND_USER -> BRAND). */
export function toApiRole(role: UserRole): string {
  if (role === UserRole.RECYCLER_USER) return 'RECYCLER';
  if (role === UserRole.BRAND_USER) return 'BRAND';
  return role;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthUserDto {
  id: string;
  email: string | null;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { email: email.trim().toLowerCase(), isActive: true },
    });
    if (!user?.passwordHash) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : null;
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: AuthUserDto }> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email ?? user.phone,
      role: toApiRole(user.role),
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email ?? user.phone,
        role: toApiRole(user.role),
      },
    };
  }

  async register(dto: RegisterDto): Promise<{ accessToken: string; user: AuthUserDto }> {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.userRepo.findOne({
      where: [{ email }, { phone: dto.phone }],
    });
    if (existing) {
      throw new ConflictException(
        existing.email === email ? 'Email already registered' : 'Phone already registered',
      );
    }
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = this.userRepo.create({
      name: dto.name,
      email,
      passwordHash,
      phone: dto.phone,
      role: dto.role,
      isActive: true,
      status: UserStatus.ACTIVE,
    });
    await this.userRepo.save(user);
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email ?? user.phone,
      role: toApiRole(user.role),
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email ?? user.phone,
        role: toApiRole(user.role),
      },
    };
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id, isActive: true } });
  }
}
