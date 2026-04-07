export declare enum OrderStatus {
    NEW = "new",
    IN_PROGRESS = "in_progress",
    DONE = "done",
    CANCELLED = "cancelled"
}
export declare enum OrderType {
    CALLBACK = "callback",
    CONSULTATION = "consultation",
    ORDER = "order"
}
export declare class OrderOrmEntity {
    id: string;
    type: OrderType;
    status: OrderStatus;
    name: string;
    phone: string;
    email: string;
    message: string;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
}
