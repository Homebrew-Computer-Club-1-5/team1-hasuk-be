import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { House } from 'src/db_entity/house/entities/house.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'tb_house_location' })
export class House_location {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column('decimal', { precision: 65, scale: 30 })
  @Field(() => Float)
  latitude: number;

  @Column('decimal', { precision: 65, scale: 30 })
  @Field(() => Float)
  longitude: number;
}
