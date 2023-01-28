import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { House_img } from "../db_entity_crud/house_img/entities/house_img.entity";
import { ImgUploadService } from "./Img.service";


@Resolver()
export class ImgUploadResolver{
    constructor(private readonly imgService: ImgUploadService){}

    //이미지링크가 주어졌을때 클라우드에 저장하기
    @Mutation(()=>[String])
    saveImage(
        @Args({name : 'img_urls', type : ()=>[String]}) img_urls: string[],
    ){
        return this.imgService.saveImgAtCloud({img_urls});
    }

}