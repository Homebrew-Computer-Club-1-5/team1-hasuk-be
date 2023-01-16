import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo/dist/drivers';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseModule } from './apis/house/house.module';
import { ImgModule } from './apis/Img/Img.module';
import { MainSpotModule } from './apis/mainSpot/mainSpot.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CrawlModule } from './apis/crawl/crawl.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MainSpotModule,
    HouseModule,
    ImgModule,
    CrawlModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: false,
    }),
    ScheduleModule.forRoot(),
  ],
  //   controllers: [AppController],
  //   providers: [AppService],
})
export class AppModule {}
