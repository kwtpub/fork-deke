# MinIO Local Setup Guide

MinIO — это S3-совместимое хранилище для локальной разработки.

## Быстрый старт

### 1. Запустите MinIO через Docker Compose

```bash
docker-compose -f docker-compose.dev.yml up -d minio
docker-compose -f docker-compose.dev.yml up minio-create-bucket
```

Это запустит:
- **MinIO API**: http://localhost:9000
- **MinIO Console**: http://localhost:9001

### 2. Credentials

По умолчанию в `.env`:
```env
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_REGION=us-east-1
AWS_S3_BUCKET=nexu-images
AWS_ENDPOINT=http://localhost:9000
```

### 3. MinIO Console (Web UI)

Откройте http://localhost:9001 

- **Username**: `minioadmin`
- **Password**: `minioadmin`

Здесь вы можете:
- Просматривать загруженные файлы
- Управлять buckets
- Настраивать права доступа

## Использование

### Загрузка файла через API

```bash
curl -X POST http://localhost:4000/api/upload/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

### Ответ

```json
{
  "data": {
    "url": "http://localhost:9000/nexu-images/products/uuid.jpg",
    "key": "products/uuid.jpg",
    "originalName": "image.jpg",
    "size": 123456
  }
}
```

## Структура папок в bucket

```
nexu-images/
├── products/     # Изображения продуктов
├── banners/      # Баннеры
├── categories/   # Изображения категорий
├── news/         # Изображения новостей
├── docs/         # Документы
└── misc/         # Прочее
```

## Docker Compose конфигурация

```yaml
minio:
  image: minio/minio:latest
  ports:
    - '9000:9000'  # API
    - '9001:9001'  # Console
  environment:
    MINIO_ROOT_USER: minioadmin
    MINIO_ROOT_PASSWORD: minioadmin
  command: server /data --console-address ":9001"
```

## Отличия MinIO от AWS S3

| Функция | MinIO | AWS S3 |
|---------|-------|--------|
| URL формат | `http://localhost:9000/bucket/key` | `https://bucket.s3.region.amazonaws.com/key` |
| Стоимость | Бесплатно | Платно |
| Скорость | Локально - быстро | Зависит от сети |
| Использование | Development | Production |

## Переключение на AWS S3

Для production просто измените `.env`:

```env
# Закомментируйте MinIO настройки
# AWS_ENDPOINT=http://localhost:9000

# Раскомментируйте AWS S3
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-production-bucket
```

Код автоматически определит, какой сервис использовать.

## Troubleshooting

### MinIO не запускается

```bash
# Проверьте логи
docker-compose -f docker-compose.dev.yml logs minio

# Перезапустите
docker-compose -f docker-compose.dev.yml restart minio
```

### Bucket не создан

```bash
# Создайте вручную
docker-compose -f docker-compose.dev.yml up minio-create-bucket
```

### Ошибка доступа

Проверьте, что в backend `.env` указаны правильные credentials:
```
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
```

## Полезные команды

```bash
# Остановить MinIO
docker-compose -f docker-compose.dev.yml stop minio

# Удалить данные MinIO
docker-compose -f docker-compose.dev.yml down -v

# Просмотреть файлы
docker exec nexu_minio_dev ls -la /data/nexu-images/products/
```
