import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  await app.get(SeederService).run();
  await app.listen(configService.get<number>('app.port') || 8080);
}
bootstrap();
