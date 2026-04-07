import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { UserOrmEntity } from './infrastructure/typeorm/user.orm-entity'
import { AuthService } from './application/auth.service'
import { AuthController } from './presentation/controllers/auth.controller'
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy'
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard'
import { RolesGuard } from './infrastructure/guards/roles.guard'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: { expiresIn: (config.get<string>('jwt.expiresIn') ?? '7d') as `${number}${'s'|'m'|'h'|'d'}` },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [JwtAuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
