import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class ImgurlOutput{
    @Field(()=>String)
    img_url : string;
}