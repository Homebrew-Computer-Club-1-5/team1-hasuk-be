import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ImgUploadService } from './Img_upload.service';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
@Resolver()
export class ImgUploadResolver {
  constructor(private readonly imgService: ImgUploadService) {}

  //이미지링크가 주어졌을때 클라우드에 저장하기
  @Mutation(() => [String])
  saveImage(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
    @Args({ name: 'house_id', type: () => Int }) house_id: number,
  ) {
    return this.imgService.saveImgAtCloud({ files }, { house_id });
  }
}
