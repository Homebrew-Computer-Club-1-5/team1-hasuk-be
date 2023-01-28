import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { House_img } from '../../db_entity/house_img/entities/house_img.entity';
import { HttpService } from '@nestjs/axios';
import { createWriteStream } from 'fs';
import { Storage } from '@google-cloud/storage';
import { resolve } from 'path';

@Injectable()
export class ImgUploadService {
  constructor(private readonly httpService: HttpService) {}

  async saveImgAtCloud({ img_urls }) {
    const storage = new Storage({
      projectId: 'board-373207',
      keyFilename: 'board-373207-a02f17b5865d.json',
    }).bucket('hasuk-storage');

    const results = await Promise.all(
      img_urls.map((el) => {
        new Promise(async (resolve, reject) => {
          const response = await this.httpService.axiosRef({
            url: el,
            method: 'GET',
            responseType: 'stream',
          });

          response.data
            .pipe(storage.file(el + '.jpg').createWriteStream())
            .on('finish', () => {
              resolve(`hasuk-storage/${el}.jpg`);
            })
            .on('error', () => {
              reject();
            });
        });
      }),
    );

    return results;
  }
}
