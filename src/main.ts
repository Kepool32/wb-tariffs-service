import * as crypto from 'crypto';

if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = {
    randomUUID: () => crypto.randomUUID(),
  } as Crypto;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
