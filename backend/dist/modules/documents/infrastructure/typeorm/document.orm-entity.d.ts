export declare enum DocumentType {
    CERTIFICATE = "certificate",
    INSTRUCTION = "instruction",
    TECHNICAL = "technical"
}
export declare class DocumentOrmEntity {
    id: string;
    name: string;
    fileUrl: string;
    thumbnailUrl: string;
    type: DocumentType;
    categoryId: string;
    isPublished: boolean;
    createdAt: Date;
}
