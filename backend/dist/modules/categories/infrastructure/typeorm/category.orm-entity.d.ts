export declare class CategoryOrmEntity {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    icon: string;
    sortOrder: number;
    parentId: string;
    parent: CategoryOrmEntity;
    children: CategoryOrmEntity[];
    createdAt: Date;
    updatedAt: Date;
}
