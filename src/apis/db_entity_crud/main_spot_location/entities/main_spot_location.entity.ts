import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Main_spot } from "../../main_spot/entities/main_spot.entity";

@ObjectType()
@Entity({name : 'tb_main_spot_location'})
export class Main_spot_location{
    @PrimaryGeneratedColumn('increment')
    @Field(()=>Int)
    id : number;

    @Column('decimal', {precision : 10, scale : 7})
    @Field(()=>Float)
    latitude : number;

    @Column('decimal', {precision : 10, scale : 7})
    @Field(()=>Float)
    longitude : number;

    @Field(()=>Main_spot)
    @OneToOne(()=> Main_spot)
    main_spot : Main_spot;

}