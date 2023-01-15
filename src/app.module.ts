import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo/dist/drivers';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseModule } from './apis/house/house.module';
import { ImgModule } from './apis/Img/Img.module';
import { MainSpotModule } from './apis/mainSpot/mainSpot.module';
import { ConfigModule } from '@nestjs/config';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    MainSpotModule,
    HouseModule,
    ImgModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',//
      port: 3306,//
      username: 'root',//
      password: 'shine2358!',//
      database: 'db_hasuk',//
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
  ],
//   controllers: [AppController],
//   providers: [AppService],
})
export class AppModule {}