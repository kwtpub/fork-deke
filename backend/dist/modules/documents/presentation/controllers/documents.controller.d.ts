import type { Repository } from 'typeorm';
import { DocumentOrmEntity, DocumentType } from '../../infrastructure/typeorm/document.orm-entity';
export declare class DocumentsController {
    private readonly repo;
    constructor(repo: Repository<DocumentOrmEntity>);
    findAll(type?: DocumentType): Promise<DocumentOrmEntity[]>;
    create(body: Partial<DocumentOrmEntity>): Promise<DocumentOrmEntity>;
    update(id: string, body: Partial<DocumentOrmEntity>): Promise<DocumentOrmEntity>;
    remove(id: string): Promise<void>;
}
