import { Module } from "@nestjs/common";
import {ImgUploadResolver } from "./Img_upload.resolver";
import {ImgUploadService } from "./Img_upload.service";
import {HttpModule} from '@nestjs/axios';

@Module({
    imports : [HttpModule],
    providers: [ImgUploadResolver, ImgUploadService],
})
export class ImgUploadModule{}

