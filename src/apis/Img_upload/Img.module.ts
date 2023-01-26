import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { House_img } from "../db_entity_crud/house_img/entities/house_img.entity";
import { ImgResolver } from "./Img.resolver";
import { ImgService } from "./Img.service";


@Module({
    imports : [TypeOrmModule.forFeature([House_img])],
    providers: [ImgResolver, ImgService],
})
export class ImgUploadModule{}