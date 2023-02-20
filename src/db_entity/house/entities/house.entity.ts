import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
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
  DeleteDateColumn,
} from 'typeorm';
import { House_cost } from '../../house_cost/entities/house_cost.entity';
import { House_category } from '../../house_category/entities/house_category.entity';
import { House_img } from '../../house_img/entities/house_img.entity';
import { House_location } from '../../house_location/entities/house_location.entity';
import { Region } from '../../region/entities/region.entity';
import { User } from '../../user/entities/user.entity';
import { Up } from 'src/db_entity/up/entities/up.entity';

@ObjectType()
@Entity({ name: 'tb_house' })
export class House {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, { nullable: true })
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
  @Field(() => Float, { nullable: true })
  board_date: number;

  @OneToOne(() => House_cost)
  @JoinColumn({ name: 'cost_id' })
  @Field(() => House_cost, { nullable: true })
  house_cost: House_cost;

  @OneToOne(() => House_location)
  @JoinColumn({ name: 'house_location_id' })
  @Field(() => House_location)
  house_location: House_location;

  @ManyToOne(() => House_category)
  @JoinColumn({ name: 'house_category_id' })
  @Field(() => House_category, { nullable: true })
  house_category: House_category;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'region_id' })
  @Field(() => Region, { nullable: true })
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

  @JoinTable({
    name: 'tb_wish',
    joinColumns: [{ name: 'house_id' }],
    inverseJoinColumns: [{ name: 'user_id' }],
  })
  @ManyToMany(() => User, (user) => user.houses)
  wish_users: User[];

  @OneToMany(() => Up, (ups) => ups.house)
  @Field(() => [Up], { nullable: 'items' })
  ups: Up[];

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt!: number | null;
}
