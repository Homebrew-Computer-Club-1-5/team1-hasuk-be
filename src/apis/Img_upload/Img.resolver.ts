import { Args, Query, Resolver } from "@nestjs/graphql";
import { House_img } from "../db_entity_crud/house_img/entities/house_img.entity";
import { ImgService } from "./Img.service";


@Resolver()
export class ImgResolver{
    constructor(private readonly imgService: ImgService){}

    //특정집의 이미지리스트 가져오기
    @Query(()=>[House_img])
    fetchImgsByHouse(
        @Args('houseId') houseId: number,
    ){
        return this.imgService.findImgByHouse({houseId});
    }

    //이미지링크가 주어졌을때 클라우드에 저장하기
    @Query(()=>String)
    saveImage(
        @Args('img_url') img_url: string,
    ){
        return this.imgService.saveImgAtCloud({img_url});
    }

}