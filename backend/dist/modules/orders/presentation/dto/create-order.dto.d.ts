import { OrderType } from '../../infrastructure/typeorm/order.orm-entity';
export declare class CreateOrderDto {
    type?: OrderType;
    name: string;
    phone: string;
    email?: string;
    message?: string;
    productId?: string;
}
