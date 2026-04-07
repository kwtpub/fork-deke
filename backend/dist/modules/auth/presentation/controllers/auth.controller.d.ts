import { AuthService } from '../../application/auth.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import type { UserOrmEntity } from '../../infrastructure/typeorm/user.orm-entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("../../infrastructure/typeorm/user.orm-entity").UserRole;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("../../infrastructure/typeorm/user.orm-entity").UserRole;
        };
    }>;
    profile(req: {
        user: UserOrmEntity;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("../../infrastructure/typeorm/user.orm-entity").UserRole;
    }>;
}
