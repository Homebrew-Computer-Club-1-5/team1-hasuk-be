import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { House } from 'src/db_entity/house/entities/house.entity';
import { User } from 'src/db_entity/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'tb_up' })
export class Up {
  @PrimaryColumn('increment')
  @Field(() => Int)
  user_id: number;

  @PrimaryColumn('increment')
  @Field(() => Int)
  house_id: number;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn({ name: 'house_id' })
  @ManyToOne(() => House)
  @Field(() => House)
  house: House;

  @CreateDateColumn()
  created_at: Date;
}
