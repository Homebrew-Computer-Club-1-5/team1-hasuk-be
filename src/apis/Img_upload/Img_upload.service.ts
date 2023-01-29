import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { createWriteStream } from 'fs';
import { Storage } from '@google-cloud/storage';
import { resolve } from 'path';

@Injectable()
export class ImgUploadService {
  constructor(
    private readonly httpService: HttpService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async saveImgAtCloud({ files }, { house_id }) {
    const waitedFiles = await Promise.all(files);

    const storage = new Storage({
      projectId: 'board-373207',
      keyFilename: 'board-373207-a02f17b5865d.json',
    }).bucket('hasuk-storage');

    const results = await Promise.all(
      waitedFiles.map((el) => {
        return new Promise(async (resolve, reject) => {
          const time = Date.now();
          //db에 이미지url삽입
          this.dataSource.query(
            'INSERT INTO tb_house_img (img_url, house_id) VALUES (?, ?) ',
            [
              'https://storage.cloud.google.com/hasuk-storage/' + time + '.jpg',
              house_id,
            ],
          );

          el.createReadStream()
            .pipe(storage.file(time + '.jpg').createWriteStream())
            .on('finish', () => {
              resolve(`hasuk-storage/${time}.jpg`);
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
