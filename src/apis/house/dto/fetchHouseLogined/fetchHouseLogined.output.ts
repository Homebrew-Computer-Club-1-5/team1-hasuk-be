import { Field, Int, ObjectType } from "@nestjs/graphql";
import { FetchHouseOutput } from "../fetchHouse/fetchHouse.output";

@ObjectType()
export class FetchHouseLoginedOutput extends FetchHouseOutput{
    @Field(() => Int)
    is_wished: number;
}