import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { UserEntity } from 'src/entities/user.entity';

export class LoginDTO {
  @IsEmail()
  @IsString()
  @MinLength(4)
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}

export class RegisterDTO extends LoginDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
}

export class UpdateUserDTO {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  image: string;

  @IsOptional()
  bio: string;
}

export interface AuthPayload {
  username: string;
}

export interface AuthResponse {
  email: string;
  username: string;
  bio: string;
  image: string | null;
  token: string;
}

export interface ProfileResponse {
  username: string;
  bio: string;
  image: string | null;
  following: boolean | null;
}
