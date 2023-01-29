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

// @ObjectType()
@Entity({ name: 'tb_user' })
export class User {
  @PrimaryGeneratedColumn('increment')
  // @Field(()=>Int)
  id: number;

  @Column({ type: 'varchar', length: '60' })
  // @Field(()=>String, {nullable : true})
  user_auth_id: string;

  @Column({ type: 'varchar', length: '60' })
  // @Field(()=>String, {nullable : true})
  name: string;

  @Column({ type: 'tinyint' })
  // @Field(()=>String, {nullable : true})
  auth_method: number;

  @JoinTable({
    name: 'tb_house_user',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'house_id' }],
  })
  @ManyToMany(() => House, (house) => house.users)
  // @Field(()=>[University])
  houses: House[];
}
