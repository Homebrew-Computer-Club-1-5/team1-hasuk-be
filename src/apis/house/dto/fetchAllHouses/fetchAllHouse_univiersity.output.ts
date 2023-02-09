import { Field, ObjectType, OmitType } from "@nestjs/graphql";
import { University } from "src/db_entity/university/entities/university.entity";

@ObjectType()
export class UniversitiyOutput extends OmitType(University,['regions']){}