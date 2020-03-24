import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from 'src/auth/user.decorator';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO, AuthResponse } from 'src/models/user.model';
import { ResponseObject } from 'src/models/response.model';

@Controller('user')
export class UserController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findCurrentUser(
    @User() { username }: UserEntity,
  ): Promise<ResponseObject<'user', AuthResponse>> {
    const user = await this.authService.findCurrentUser(username);
    return { user };
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(
    @User() { username }: UserEntity,
    @Body('user', new ValidationPipe({ transform: true, whitelist: true }))
    data: UpdateUserDTO,
  ): Promise<ResponseObject<'user', AuthResponse>> {
    const user = await this.authService.updateUser(username, data);
    return { user };
  }
}
