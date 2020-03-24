import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { OptionalAuthGuard } from 'src/auth/optional-auth.gaurd';
import { UserService } from './user.service';
import { ResponseObject } from 'src/models/response.model';
import { ProfileResponse } from 'src/models/user.model';

@Controller('profiles')
export class ProfileController {
  constructor(private userService: UserService) {}

  @Get('/:username')
  @UseGuards(new OptionalAuthGuard())
  async findProfile(
    @Param('username') username: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'profile', ProfileResponse>> {
    const profile = await this.userService.findByUsername(username, user);
    if (!profile) {
      throw new NotFoundException();
    }
    return { profile };
  }

  @Post('/:username/follow')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  async followUser(
    @User() user: UserEntity,
    @Param('username') username: string,
  ): Promise<ResponseObject<'profile', ProfileResponse>> {
    const profile = await this.userService.followUser(user, username);
    return { profile };
  }

  @Delete('/:username/follow')
  @UseGuards(AuthGuard())
  async unfollowUser(
    @User() user: UserEntity,
    @Param('username') username: string,
  ): Promise<ResponseObject<'profile', ProfileResponse>> {
    const profile = await this.userService.unfollowUser(user, username);
    return { profile };
  }
}
