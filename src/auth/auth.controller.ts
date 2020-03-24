import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDTO, LoginDTO, AuthResponse } from '../models/user.model';
import { ResponseObject } from 'src/models/response.model';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async register(
    @Body(ValidationPipe) credentials: RegisterDTO,
  ): Promise<ResponseObject<'user', AuthResponse>> {
    const user = await this.authService.register(credentials);
    return { user };
  }

  @Post('/login')
  async login(
    @Body('user', ValidationPipe) credentials: LoginDTO,
  ): Promise<ResponseObject<'user', AuthResponse>> {
    const user = await this.authService.login(credentials);
    return { user };
  }
}
