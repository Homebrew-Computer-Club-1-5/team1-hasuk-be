import { ObjectType, OmitType } from "@nestjs/graphql";
import { House_category } from "src/db_entity/house_category/entities/house_category.entity";

@ObjectType()
export class CategoryOutput extends OmitType(House_category, ['houses']){}