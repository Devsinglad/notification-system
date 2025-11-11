import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('validate')
  @ApiOperation({ summary: 'Validate user credentials' })
  @ApiResponse({ status: 200, description: 'Credentials valid' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async validateUser(@Body() loginUserDto: LoginUserDto) {
    const user = await this.usersService.validateCredentials(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}