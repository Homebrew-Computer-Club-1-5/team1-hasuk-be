import { Field, Int, ObjectType } from "@nestjs/graphql";
import { JoinTable, ManyToMany, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Region } from "../../region/entities/region.entity";

@ObjectType()
@Entity({name : 'tb_university'})
export class University{
    @PrimaryGeneratedColumn('increment')
    @Field(()=>Int)
    id : number;

    @Column()
    @Field(()=>String)
    name : string;

    @ManyToMany(() => Region, (regions) => regions.universities)
    @JoinTable({
        joinColumns:[{name: 'university_id'}],
        inverseJoinColumns:[{name: 'region_id'}]
    })
    
    @Field(()=>[Region])
    regions : Region[];
}