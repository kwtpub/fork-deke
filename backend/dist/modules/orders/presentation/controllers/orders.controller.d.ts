import type { Repository } from 'typeorm';
import { OrderOrmEntity } from '../../infrastructure/typeorm/order.orm-entity';
import { CreateOrderDto } from '../dto/create-order.dto';
export declare class OrdersController {
    private readonly repo;
    constructor(repo: Repository<OrderOrmEntity>);
    create(dto: CreateOrderDto): Promise<OrderOrmEntity>;
    findAll(status?: string): Promise<OrderOrmEntity[]>;
    update(id: string, body: Partial<OrderOrmEntity>): Promise<OrderOrmEntity>;
}
