import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Main_spot } from '../../db_entity/main_spot/entities/main_spot.entity';

@Injectable()
export class MainSpotService {
  constructor(
    @InjectRepository(Main_spot)
    private readonly main_spot_repository: Repository<Main_spot>,
  ) {}

  async findAllMainSpot() {
    return await this.main_spot_repository.find({
      relations: ['main_spot_location'],
    });
  }
}
