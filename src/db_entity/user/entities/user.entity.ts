import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Up } from 'src/db_entity/up/entities/up.entity';
import {
  ManyToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { House } from '../../house/entities/house.entity';

@ObjectType()
@Entity({ name: 'tb_user' })
export class User {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column({ type: 'varchar', length: '60' })
  @Field(() => String, { nullable: true })
  user_auth_id: string;

  @Column({ type: 'varchar', length: '60' })
  @Field(() => String, { nullable: true })
  name: string;

  @Column({ type: 'tinyint' })
  @Field(() => Int, { nullable: true })
  auth_method: number;

  @Column({ type: 'varchar', length: '60' })
  age_range: string;

  @JoinTable({
    name: 'tb_house_user',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'house_id' }],
  })
  @ManyToMany(() => House, (house) => house.users)
  @Field(() => [House])
  houses: House[];

  @JoinTable({
    name: 'tb_wish',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'house_id' }],
  })
  @ManyToMany(() => House, (house) => house.wish_users)
  @Field(() => [House], {nullable: true})
  wish_houses: House[];

  @OneToMany(() => Up, (ups) => ups.user)
  @Field(() => [Up], { nullable: 'items' })
  ups: Up[];
}
