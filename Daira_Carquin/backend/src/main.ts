import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiKeyGuard } from './infrastructure/guards/api-key.guard';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.enableCors({
      origin: 'http://localhost:4000',
    })
    app.useGlobalGuards(new ApiKeyGuard(configService));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
