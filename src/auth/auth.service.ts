import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/entities/user.entity';
import {
  LoginDTO,
  RegisterDTO,
  UpdateUserDTO,
  AuthResponse,
} from 'src/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async register(credentials: RegisterDTO): Promise<AuthResponse> {
    try {
      const user = this.userRepo.create(credentials);
      await user.save();
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      return { ...user.toJSON(), token };
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username has already been taken');
      }
      throw new InternalServerErrorException();
    }
  }

  async login({ email, password }: LoginDTO): Promise<AuthResponse> {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      return { ...user.toJSON(), token };
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async findCurrentUser(username: string): Promise<AuthResponse> {
    const user = await this.userRepo.findOne({ where: { username } });
    const payload = { username };
    const token = this.jwtService.sign(payload);
    return { ...user.toJSON(), token };
  }

  async updateUser(
    username: string,
    data: UpdateUserDTO,
  ): Promise<AuthResponse> {
    await this.userRepo.update({ username }, data);
    const user = await this.userRepo.findOne({ where: { username } });
    const payload = { username };
    const token = this.jwtService.sign(payload);
    return { ...user.toJSON(), token };
  }
}
