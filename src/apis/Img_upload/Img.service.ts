import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { House_img } from "../db_entity_crud/house_img/entities/house_img.entity";
import { HttpService } from '@nestjs/axios';
import { createWriteStream } from 'fs';


@Injectable()
export class ImgService{
    constructor(
        private readonly httpService : HttpService,
        @InjectRepository(House_img)
        private readonly house_img_repository : Repository<House_img>,
    ){}

    async findImgByHouse({houseId}){
        return await this.house_img_repository.find({
            where: {house : {id : houseId}},
        });
    }

    async saveImgAtCloud({img_url}){
        const response = await this.httpService.axiosRef({
            url: 'https://docs.nestjs.com/assets/logo-small.svg',
            method: 'GET',
            responseType: 'stream',
          });
          
          const writer = createWriteStream('./img_store');
          response.data.pipe(writer);
        return 'complete';
    }
}