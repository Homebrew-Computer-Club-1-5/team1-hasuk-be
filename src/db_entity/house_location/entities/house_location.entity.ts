import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
