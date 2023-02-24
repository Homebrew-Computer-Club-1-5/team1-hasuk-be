import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { urlencoded, json } from 'body-parser';

import { Logger } from '@nestjs/common';

const oldConsoleLog = console.log;

if (process.env.NODE_ENV === 'production') {
  const appLogger = new Logger('Application');

  console.log = function (...args: any[]) {
    appLogger.debug.apply(appLogger, args);
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.use(graphqlUploadExpress());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  console.log(`server listing on ${process.env.PORT}`);

  await app.listen(process.env.PORT);
}
bootstrap();
