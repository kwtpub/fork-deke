import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './shared/filters/http-exception.filter'
import { TransformInterceptor } from './shared/interceptors/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets(join(process.cwd(), '..', 'uploads'), { prefix: '/uploads' })
  const config = app.get(ConfigService)

  app.setGlobalPrefix('api')
  app.enableCors({
    origin: config.get<string>('app.frontendUrl'),
    credentials: true,
  })

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Döcke API')
    .setDescription('API для сайта строительных материалов Döcke')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document)

  const port = config.get<number>('app.port', 4000)
  await app.listen(port)
  console.log(`🚀 Server running on http://localhost:${port}/api`)
  console.log(`📚 Swagger: http://localhost:${port}/api/docs`)
}

bootstrap()
