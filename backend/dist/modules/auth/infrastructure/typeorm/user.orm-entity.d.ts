export declare enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager"
}
export declare class UserOrmEntity {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
