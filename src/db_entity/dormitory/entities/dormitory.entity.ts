import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Calendar } from "src/db_entity/calendar/entities/calendar.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity({name: 'tb_dormitory'})
export class Dormitory{
    @PrimaryGeneratedColumn('increment')
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => String)
    name: string;

    @Column()
    @Field(()=>String)
    board_url: string;

    @OneToMany(()=> Calendar, (calendar)=>calendar.dormitory)
    calendar: Calendar[];
}
