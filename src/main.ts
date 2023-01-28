import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ImgModule } from './apis/Img/Img.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  console.log(`server listing on ${process.env.PORT}`);

  console.log('실행중');

  await app.listen(process.env.PORT);
}
bootstrap();
