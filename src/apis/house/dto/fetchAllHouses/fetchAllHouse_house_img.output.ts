import { ObjectType, OmitType } from "@nestjs/graphql";
import { House_img } from "src/db_entity/house_img/entities/house_img.entity";

@ObjectType()
export class ImgOutput extends OmitType(House_img, ['house']){}