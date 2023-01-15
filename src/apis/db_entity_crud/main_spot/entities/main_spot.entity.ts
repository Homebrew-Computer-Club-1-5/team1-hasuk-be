import { Field, Int, ObjectType } from "@nestjs/graphql";
import { JoinColumn, OneToOne, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Main_spot_location } from "../../main_spot_location/entities/main_spot_location.entity";

@ObjectType()
@Entity({name : 'tb_main_spot'})
export class Main_spot{
    @PrimaryGeneratedColumn('increment')
    @Field(()=>Int)
    id : number;

    @Column()
    @Field(()=>String)
    name : string;

    @Field(()=>Main_spot_location)
    @OneToOne(()=> Main_spot_location)
    @JoinColumn({name : 'main_spot_location_id'})
    main_spot_location : Main_spot_location;
    
}