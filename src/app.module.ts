import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo/dist/drivers';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseModule } from './apis/house/house.module';
import { ImgModule } from './apis/Img/Img.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MainSpotModule } from './apis/mainSpot/mainSpot.module';
import { CrawlModule } from './apis/crawl/crawl.module';
import { AuthModule } from './apis/auth/auth.module';
import { UserModule } from './apis/user/user.module';
import { UpModule } from './apis/up/up.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development.local'
          ? '.env.development.local'
          : process.env.NODE_ENV === 'development.remote'
          ? '.env.development.remote'
          : process.env.NODE_ENV === 'docker.local'
          ? '.env.docker.local'
          : process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid(
            'development.local',
            'development.remote',
            'docker.local',
            'production',
          )
          .required(),
        PORT: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        KAKAO_REST_API_KEY: Joi.string().required(),
        KAKAO_REDIRECT_URI: Joi.string().required(),
        CLIENT_URL: Joi.string().required(),
        CRAWL_EXECUTABLEPATH: Joi.string().required(),
        GOOGLE_IMAGE_STORAGE: Joi.string().required(),
      }),
    }),
    MainSpotModule,
    HouseModule,
    ImgModule,
    CrawlModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql',
      cors: {
        origin: process.env.CLIENT_URL,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      },
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
      bigNumberStrings: false,
      supportBigNumbers: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    UpModule,
  ],
})
export class AppModule {}
