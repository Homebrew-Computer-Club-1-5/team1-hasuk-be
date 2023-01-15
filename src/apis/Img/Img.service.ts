import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { House_img } from "../db_entity_crud/house_img/entities/house_img.entity";


@Injectable()
export class ImgService{
    constructor(
        @InjectRepository(House_img)
        private readonly house_img_repository : Repository<House_img>,
    ){}

    async findImgByHouse({houseId}){
        return await this.house_img_repository.find({
            where: {house : {id : houseId}},
        });
    }
}