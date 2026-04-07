import { JwtService } from '@nestjs/jwt';
import type { Repository } from 'typeorm';
import { UserOrmEntity } from '../infrastructure/typeorm/user.orm-entity';
import type { LoginDto, RegisterDto } from '../presentation/dto/auth.dto';
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    constructor(userRepo: Repository<UserOrmEntity>, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("../infrastructure/typeorm/user.orm-entity").UserRole;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("../infrastructure/typeorm/user.orm-entity").UserRole;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("../infrastructure/typeorm/user.orm-entity").UserRole;
    }>;
    private signToken;
}
