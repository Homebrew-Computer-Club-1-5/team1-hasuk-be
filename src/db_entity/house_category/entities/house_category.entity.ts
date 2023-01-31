import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { House } from "../../house/entities/house.entity";

@ObjectType()
@Entity({name : 'tb_house_category'})
export class House_category{
    @PrimaryGeneratedColumn('increment')
    @Field(()=>Int)
    id : number;

    @Column()
    @Field(()=>String)
    name : string;

    @OneToMany(()=> House, (houses)=>houses.house_category)
    @Field(()=>[House], {nullable : 'items'})
    houses: House[];
}