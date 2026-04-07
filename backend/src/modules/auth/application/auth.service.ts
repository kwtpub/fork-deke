import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { UserOrmEntity } from '../infrastructure/typeorm/user.orm-entity'
import type { LoginDto, RegisterDto } from '../presentation/dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email, isActive: true } })
    if (!user) throw new UnauthorizedException('Неверный email или пароль')

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Неверный email или пароль')

    return this.signToken(user)
  }

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } })
    if (exists) throw new ConflictException('Пользователь с таким email уже существует')

    const passwordHash = await bcrypt.hash(dto.password, 10)
    const user = this.userRepo.create({ email: dto.email, passwordHash, name: dto.name })
    await this.userRepo.save(user)

    return this.signToken(user)
  }

  async getProfile(userId: string) {
    return this.userRepo.findOneOrFail({ where: { id: userId } }).then((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
    }))
  }

  private signToken(user: UserOrmEntity) {
    const payload = { sub: user.id, email: user.email, role: user.role }
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    }
  }
}
