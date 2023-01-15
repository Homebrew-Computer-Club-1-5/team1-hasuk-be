import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { House } from "../../house/entities/house.entity";


@ObjectType()
@Entity({name : 'tb_house_img'})
export class House_img{
    @PrimaryGeneratedColumn('increment')
    @Field(()=>Int)
    id : number;

    @Column({type: 'varchar', length: 2083})
    @Field(()=>String)
    img_url : string;


    @ManyToOne(()=>House)
    @JoinColumn({name : 'house_id'})
    @Field(()=> House)
    house : House;

}