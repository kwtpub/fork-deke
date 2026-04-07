# AWS S3 Integration Guide

## Настройка AWS S3 для хранения изображений

### 1. Создайте S3 Bucket

1. Войдите в AWS Console
2. Перейдите в S3
3. Нажмите "Create bucket"
4. Укажите уникальное имя (например, \`docke-images\`)
5. Выберите регион (например, \`us-east-1\`)
6. Создайте bucket

### 2. Настройте переменные окружения

В файле \`.env\`:

\`\`\`env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=docke-images
AWS_CDN_URL=https://cdn.example.com (опционально)
\`\`\`

### 3. API Endpoint

\`\`\`bash
POST /api/upload/:folder
Authorization: Bearer {token}
Folders: products | banners | categories | news | docs
\`\`\`

Подробная инструкция - см. полный файл на GitHub.
