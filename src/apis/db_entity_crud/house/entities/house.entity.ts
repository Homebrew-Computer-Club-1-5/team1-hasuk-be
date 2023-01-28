import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  ManyToOne,
  JoinColumn,
  OneToOne,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Cost } from '../../cost/entities/cost.entity';
import { House_category } from '../../house_category/entities/house_category.entity';
import { House_img } from '../../house_img/entities/house_img.entity';
import { House_location } from '../../house_location/entities/house_location.entity';
import { Region } from '../../region/entities/region.entity';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity({ name: 'tb_house' })
export class House {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  contact_number: string;

  @Column({ type: 'tinyint', nullable: true })
  @Field(() => Int, { nullable: true })
  gender: number;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  house_other_info: string;

  @Column({ type: 'tinyint', nullable: true })
  @Field(() => Int, { nullable: true })
  has_empty: number;

  @Column({ type: 'tinyint', nullable: true })
  @Field(() => Int, { nullable: true })
  is_crolled: number;

  @Column({ type: 'bigint', nullable: true })
  @Field(() => Int, { nullable: true })
  board_date: number;

  @OneToOne(() => Cost)
  @JoinColumn({ name: 'cost_id' })
  @Field(() => Cost)
  cost: Cost;

  @OneToOne(() => House_location)
  @JoinColumn({ name: 'house_location_id' })
  @Field(() => House_location)
  house_location: House_location;

  @ManyToOne(() => House_category)
  @JoinColumn({ name: 'house_category_id' })
  @Field(() => House_category)
  house_category: House_category;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'region_id' })
  @Field(() => Region)
  region: Region;

  @OneToMany(() => House_img, (imgs) => imgs.house)
  @Field(() => [House_img], { nullable: 'items' })
  imgs: House_img[];

  @JoinTable({
    name: 'tb_house_user',
    joinColumns: [{ name: 'house_id' }],
    inverseJoinColumns: [{ name: 'user_id' }],
  })
  @ManyToMany(() => User, (user) => user.houses)
  users: User[];
}
