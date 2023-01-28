import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity({name: 'tb_cost'})
export class Cost{
    @PrimaryGeneratedColumn('increment')
    @Field(()=>Int)
    id : number;

    @Column()
    @Field(()=>Int)
    month_cost : number;

    @Column({nullable : true})
    @Field(()=>Int, {nullable : true})
    deposit : number;

    @Column('text', {nullable : true})
    @Field(()=>String, {nullable : true})
    other_info : string;
}