import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  ManyToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { House } from '../../house/entities/house.entity';
import { University } from '../../university/entities/university.entity';

@ObjectType()
@Entity({ name: 'tb_region' })
export class Region {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  name: string;

  @JoinTable({
    name: 'tb_university_region',
    joinColumns: [{ name: 'region_id' }],
    inverseJoinColumns: [{ name: 'university_id' }],
  })
  @ManyToMany(() => University, (universities) => universities.regions)
  @Field(() => [University])
  universities: University[];

  @OneToMany(() => House, (houses) => houses.region)
  @Field(() => [House], { nullable: 'items' })
  houses: House[];
}
