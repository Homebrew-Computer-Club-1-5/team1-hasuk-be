import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Dormitory } from 'src/db_entity/dormitory/entities/dormitory.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'tb_calendar' })
export class Calendar {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  post_title: string;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  @Field(() => Date, { nullable: true })
  post_date: Date;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  post_link: string;

  @ManyToOne(() => Dormitory)
  @JoinColumn({ name: 'dormitory_id' })
  @Field(() => Dormitory, { nullable: true })
  dormitory: Dormitory;
}
