import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo/dist/drivers';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MainSpotModule } from './apis/mainSpot/mainSpot.module';
import { CrawlModule } from './apis/crawl/crawl.module';
import { HouseModule } from './apis/house/house.module';
// import { ImgModule } from './apis/Img/Img.module';
// import { ImgUploadModule } from './apis/Img_upload/Img.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MainSpotModule,
    HouseModule,
    // ImgModule,
    // ImgUploadModule,
    CrawlModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/db_entity/**/*.entity.*'],
      synchronize: true,
      logging: false,
    }),
    ScheduleModule.forRoot(),
  ],
  //   controllers: [AppController],
  //   providers: [AppService],
})
export class AppModule {}
