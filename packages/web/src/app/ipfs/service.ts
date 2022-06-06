import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ImageUploadError } from '../errors/image-upload-error';
import { WebErrorCodes } from '../errors/codes';
import { ImageUploadResponse } from '../types/requests';
import { ImageUploader } from './uploader/ImageUploader';
import { ZipUploader } from './uploader/ZipUploader';

@Injectable()
export class IpfsService {
  private imageUploader: ImageUploader;

  private zipUploader: ZipUploader;

  constructor(configService: ConfigService) {
    this.imageUploader = new ImageUploader(configService);
    this.zipUploader = new ZipUploader(configService);
  }

  public async uploadFile(file): Promise<ImageUploadResponse> {
    if (!file) {
      throw new ImageUploadError(
        WebErrorCodes.InvalidPayload,
        'Invalid payload',
      );
    }

    if (file.mimetype === 'application/zip') {
      return this.zipUploader.uploadZip(file);
    }

    return this.imageUploader.uploadFile(file);
  }
}
