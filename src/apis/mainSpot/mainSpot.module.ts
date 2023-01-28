import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Main_spot } from '../../db_entity/main_spot/entities/main_spot.entity';
import { MainSpotResolver } from './mainSpot.resolver';
import { MainSpotService } from './mainSpot.service';

@Module({
  imports: [TypeOrmModule.forFeature([Main_spot])],
  providers: [MainSpotResolver, MainSpotService],
})
export class MainSpotModule {}
