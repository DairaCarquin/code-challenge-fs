import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiKeyGuard } from './infrastructure/guards/api-key.guard';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.useGlobalGuards(new ApiKeyGuard(configService));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
