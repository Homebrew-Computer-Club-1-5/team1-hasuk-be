import { ObjectType, OmitType } from "@nestjs/graphql";
import { Main_spot_location } from "src/db_entity/main_spot_location/entities/main_spot_location.entity";

@ObjectType()
export class Main_spot_locationOutput extends OmitType(Main_spot_location, ['main_spot']){}