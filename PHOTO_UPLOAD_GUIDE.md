# Руководство по загрузке фото для товаров

## Что было сделано

### 1. Компонент FileUpload
Создан новый компонент `FileUpload` для загрузки файлов:
- **Путь**: `frontend/src/shared/ui/FileUpload/`
- **Файлы**: 
  - `FileUpload.tsx` - Основной компонент с drag-and-drop функциональностью
  - `FileUpload.module.scss` - Стили компонента
  - `index.ts` - Экспорт компонента

### 2. Интеграция в форму создания товара
Компонент `FileUpload` интегрирован в `AdminProductNewPage.tsx`:
- Добавлено поле `images` в состояние формы (массив URL)
- При загрузке файлов URLs сохраняются в состояние
- При отправке формы массив `images` отправляется на сервер

### 3. Бэкенд поддержка
- **S3/MinIO сервис** уже поддерживает загрузку: `src/shared/s3/s3.service.ts`
- **Upload контроллер** принимает файлы: `src/modules/upload/presentation/controllers/upload.controller.ts`
- **Product ORM сущность** имеет поле `images: string[]`
- **Product контроллер** принимает массив images при создании товара

## Как использовать

### На фронтенде

1. Откройте http://localhost:3000
2. Перейдите в админ панель
3. Нажмите "Новый продукт"
4. Заполните форму товара
5. В разделе "Изображения товара" перетащите изображения или нажмите для выбора
6. Изображения будут загружены в MinIO и отображены в превью
7. Нажмите "Создать продукт" - товар будет создан с прикреплёнными фото

### API пример

```bash
# 1. Авторизация
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexu.su","password":"admin123"}' | jq -r '.data.access_token')

# 2. Загрузка изображения
RESPONSE=$(curl -s -X POST http://localhost:4000/api/upload/products \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg")

IMAGE_URL=$(echo $RESPONSE | jq -r '.data.url')

# 3. Создание товара с изображением
curl -X POST http://localhost:4000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Мой товар\",
    \"slug\": \"my-product\",
    \"categoryId\": \"category-uuid\",
    \"images\": [\"$IMAGE_URL\"],
    \"priceFrom\": 1999.99
  }"
```

## Хранилище файлов

### Для локальной разработки
- **MinIO** работает на `http://localhost:9000`
- **Консоль MinIO**: `http://localhost:9001`
- Логин: `minioadmin` / пароль: `minioadmin`
- Bucket: `nexu-images`
- Папка для товаров: `products/`

### Для production
- Используется AWS S3 (настраивается через .env)
- Поддерживается CDN через CloudFront

## Структура загруженных файлов

```
nexu-images/
├── products/          # Изображения товаров
├── banners/           # Банеры
├── categories/        # Категории
├── news/              # Новости
├── docs/              # Документы
└── misc/              # Прочее
```

## Технические детали

- **Формат загрузки**: multipart/form-data
- **Поддерживаемые форматы**: JPG, PNG, WebP, GIF, и другие
- **Размер файла**: Не ограничен (настраивается через multer)
- **Хранение URL**: Сохраняются в поле `images` товара как массив строк
- **Тип поля БД**: `simple-array` в PostgreSQL

## Форматы URL

### MinIO (локальная разработка)
```
http://localhost:9000/nexu-images/products/uuid.extension
```

### AWS S3 (production без CDN)
```
https://nexu-images.s3.region.amazonaws.com/products/uuid.extension
```

### CloudFront CDN (production оптимальный вариант)
```
https://cdn.example.com/products/uuid.extension
```

## Заметки

- Компонент FileUpload поддерживает multi-file upload (одновременно несколько файлов)
- Есть предпросмотр загруженных файлов с возможностью удаления
- При удалении из превью, файл остаётся на сервере (но не добавляется в товар)
- Требуется авторизация для загрузки файлов
