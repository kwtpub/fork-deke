# Деплой и CI/CD

Прод-сервер: Ubuntu, Docker уже установлен. Деплой — через GitHub Actions в GHCR + SSH pull.

## 1. Первичная подготовка сервера (один раз)

Под root:

```bash
# 1.1 Смени root-пароль (он был скомпрометирован в чате)
passwd

# 1.2 Создай deploy-пользователя
adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy
mkdir -p /home/deploy/.ssh && chmod 700 /home/deploy/.ssh

# 1.3 Добавь публичный SSH-ключ (локально: ssh-keygen -t ed25519 -f ~/.ssh/deke_deploy)
echo "ssh-ed25519 AAAA... твой_публичный_ключ" >> /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh

# 1.4 Отключи парольную аутентификацию и root по SSH
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart ssh

# 1.5 Директория для деплоя
mkdir -p /opt/deke && chown deploy:deploy /opt/deke
```

Теперь заходи как `deploy@193.233.88.233`.

## 2. Конфиги на сервере

В `/opt/deke/`:

- `.env` — на основе `.env.prod.example` (Postgres credentials).
- `backend.env` — на основе `backend.env.example` (секреты приложения).
- `docker-compose.prod.yml` — кладётся автоматически из CI.

```bash
# На сервере
cd /opt/deke
nano .env           # заполни из .env.prod.example
nano backend.env    # заполни из backend.env.example
chmod 600 .env backend.env
```

## 3. GitHub Secrets

В репозитории → Settings → Secrets and variables → Actions:

| Secret        | Значение                                                                   |
| ------------- | -------------------------------------------------------------------------- |
| `SSH_HOST`    | `193.233.88.233`                                                           |
| `SSH_USER`    | `deploy`                                                                   |
| `SSH_KEY`    | Приватный ключ (`cat ~/.ssh/deke_deploy`) целиком, включая BEGIN/END строки |
| `GHCR_USER`   | Твой GitHub username                                                       |
| `GHCR_TOKEN`  | Personal Access Token с scope `read:packages` (classic PAT)                |

## 4. Workflow

`.github/workflows/deploy.yml` на push в `main`:

1. Собирает образы backend и frontend.
2. Пушит в `ghcr.io/<owner>/<repo>/backend:<sha>` и `...frontend:<sha>` (+ `:latest`).
3. По SSH заходит на сервер, делает `docker compose pull && up -d`.

Первый запуск вручную — после заполнения `.env` на сервере сделай push в `main` или запусти workflow через кнопку **Run workflow**.

## 5. Проверка

```bash
# На сервере
docker compose -f /opt/deke/docker-compose.prod.yml ps
docker compose -f /opt/deke/docker-compose.prod.yml logs -f backend
curl http://localhost/api/health   # если есть health-эндпоинт
```

Сайт будет доступен по `http://193.233.88.233/`.

## 6. Домен и HTTPS (когда появится)

Добавь в compose сервис `caddy` (автоматический Let's Encrypt) или traefik. Переключи `frontend` с `ports: 80:80` на internal и выставляй наружу только caddy на 80/443.

Пример Caddyfile:

```
example.com {
    reverse_proxy frontend:80
}
```

## 7. Локальная разработка

Без изменений — используй `docker-compose.yml` / `docker-compose.dev.yml`, они не трогаются CI.
