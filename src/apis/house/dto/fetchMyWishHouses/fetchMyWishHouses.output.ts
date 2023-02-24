import { ObjectType } from "@nestjs/graphql";
import { FetchMyHouseOutput } from "../fetchMyHouse/fetchMyHouse.output";

@ObjectType()
export class FetchMyWishHousesOutput extends FetchMyHouseOutput{}