import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ManyToOne, JoinColumn, OneToOne, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Cost } from "../../cost/entities/cost.entity";
import { House_category } from "../../house_category/entities/house_category.entity";
import { House_img } from "../../house_img/entities/house_img.entity";
import { House_location } from "../../house_location/entities/house_location.entity";
import { Region } from "../../region/entities/region.entity";


@ObjectType()
@Entity({name : 'tb_house'})
export class House{
    @PrimaryGeneratedColumn('increment')
    @Field(() => Int)
    id : number;

    @Column()
    @Field(() => String)
    contact_number : string;

    @Column({type : 'tinyint'})
    @Field(() => Int)
    gender : number;

    @Column()
    @Field(() => String)
    min_residence : string;

    @Column('text', {nullable : true})
    @Field(()=>String, {nullable : true})
    house_other_info : string;

    @Column({type : 'tinyint'})
    @Field(() => Int)
    has_empty : number;

    @Column({type : 'tinyint'})
    @Field(() => Int)
    is_crolled : number;

    @OneToOne(() => Cost)
    @JoinColumn({ name : 'cost_id'})
    @Field(() => Cost)
    cost : Cost;

    @OneToOne(() => House_location)
    @JoinColumn({name : 'house_location_id'})
    @Field(()=>House_location)
    house_location : House_location;

    @ManyToOne(() => House_category)
    @JoinColumn({name : 'house_category_id'})
    @Field(()=>House_category)
    house_category : House_category;

    @ManyToOne(() => Region)
    @JoinColumn({name : 'region_id'})
    @Field(()=>Region)
    region : Region;

    @OneToMany(()=> House_img, (imgs)=>imgs.house)
    @Field(()=>[House_img], {nullable :'items'})
    imgs: House_img[];
}