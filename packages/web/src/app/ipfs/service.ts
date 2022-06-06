import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IpfsError } from '../errors/ipfs-error';
import { WebErrorCodes } from '../errors/codes';
import { IpfsUploadResponse } from '../types/requests';
import { FileUploader } from './uploader/FileUploader';
import { ZipUploader } from './uploader/ZipUploader';

@Injectable()
export class IpfsService {
  private fileUploader: FileUploader;

  private zipUploader: ZipUploader;

  constructor(configService: ConfigService) {
    this.fileUploader = new FileUploader(configService);
    this.zipUploader = new ZipUploader(configService);
  }

  public async uploadFile(file): Promise<IpfsUploadResponse> {
    if (!file) {
      throw new IpfsError(WebErrorCodes.InvalidPayload, 'Invalid payload');
    }

    if (file.mimetype === 'application/zip') {
      return this.zipUploader.uploadZip(file);
    }

    return this.fileUploader.uploadFile(file);
  }
}
