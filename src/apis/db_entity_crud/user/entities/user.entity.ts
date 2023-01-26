import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  ManyToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { House } from '../../house/entities/house.entity';

// @ObjectType()
@Entity({ name: 'tb_user' })
export class User {
  @PrimaryGeneratedColumn('increment')
  // @Field(()=>Int)
  id: number;

  @Column({ type: 'varchar', length: '40' })
  // @Field(()=>String, {nullable : true})
  user_auth_id: string;

  @Column({ type: 'varchar', length: '15' })
  // @Field(()=>String, {nullable : true})
  name: string;

  @Column({ type: 'tinyint', length: '1' })
  // @Field(()=>String, {nullable : true})
  auth_method: number;

  @ManyToMany(() => University, (universities) => universities.regions)
  // @Field(()=>[University])
  universities: University[];

  @OneToMany(() => House, (houses) => houses.region)
  // @Field(()=>[House], {nullable : 'items'})
  houses: House[];
}
