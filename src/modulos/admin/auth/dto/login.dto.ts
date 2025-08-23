import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ description: 'Email', example: 'example@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @IsStrongPassword()
  @ApiProperty({ description: 'Password', example: '************' })
  @IsString()
  @IsNotEmpty()
  password: string;
}