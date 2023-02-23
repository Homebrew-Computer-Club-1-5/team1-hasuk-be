import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'tb_house_cost' })
export class House_cost {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  month_cost: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  deposit: number;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  other_info: string;
}
