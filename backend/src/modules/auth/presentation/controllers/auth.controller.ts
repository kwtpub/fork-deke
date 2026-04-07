import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from '../../application/auth.service'
import { LoginDto, RegisterDto } from '../dto/auth.dto'
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard'
import type { UserOrmEntity } from '../../infrastructure/typeorm/user.orm-entity'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Вход' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('register')
  @ApiOperation({ summary: 'Регистрация (первый admin)' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Текущий пользователь' })
  profile(@Request() req: { user: UserOrmEntity }) {
    return this.authService.getProfile(req.user.id)
  }
}
