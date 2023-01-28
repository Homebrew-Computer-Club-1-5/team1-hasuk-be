import { Module } from "@nestjs/common";
import {ImgUploadResolver } from "./Img.resolver";
import {ImgUploadService } from "./Img.service";
import {HttpModule} from '@nestjs/axios';

@Module({
    imports : [HttpModule],
    providers: [ImgUploadResolver, ImgUploadService],
})
export class ImgUploadModule{}

