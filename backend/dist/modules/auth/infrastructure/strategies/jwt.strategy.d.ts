import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Repository } from 'typeorm';
import { UserOrmEntity } from '../typeorm/user.orm-entity';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userRepo;
    constructor(configService: ConfigService, userRepo: Repository<UserOrmEntity>);
    validate(payload: JwtPayload): Promise<UserOrmEntity>;
}
export {};
