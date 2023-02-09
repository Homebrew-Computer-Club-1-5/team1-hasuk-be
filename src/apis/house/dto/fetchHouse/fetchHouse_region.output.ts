import { ObjectType, OmitType } from "@nestjs/graphql";
import { Region } from "src/db_entity/region/entities/region.entity";

@ObjectType()
export class RegionOutput extends OmitType(Region, ['universities', 'houses']){}