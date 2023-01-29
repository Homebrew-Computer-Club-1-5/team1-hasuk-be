import { Args, Query, Resolver } from '@nestjs/graphql';
import { House_img } from '../../db_entity/house_img/entities/house_img.entity';
import { ImgService } from './Img.service';

@Resolver()
export class ImgResolver {
  constructor(private readonly imgService: ImgService) {}

  //특정집의 이미지리스트 가져오기
  @Query(() => [House_img])
  fetchImgsByHouse(@Args('houseId') houseId: number) {
    return this.imgService.findImgByHouse({ houseId });
  }
}
