import { extname } from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IpfsError } from '../../../errors/ipfs-error';
import { WebErrorCodes } from '../../../errors/codes';
import { IpfsUploadResponse } from '../../../types/requests';
import { IpfsUploader } from './IpfsUploader';

@Injectable()
export class FileUploader extends IpfsUploader {
  constructor(configService: ConfigService) {
    super(configService);
  }

  public async upload(file): Promise<IpfsUploadResponse> {
    if (!file) {
      throw new IpfsError(WebErrorCodes.InvalidPayload, 'Invalid payload');
    }

    const mimeSuccess = await this.isAllowMimeType(file.buffer, {
      mime: file.mimetype,
      ext: extname(file.originalname).slice(1),
    });
    if (!mimeSuccess) {
      throw new IpfsError(WebErrorCodes.InvalidFiletype, 'Invalid filetype');
    }

    return this.uploadFile(file);
  }

  private async uploadFile(file): Promise<IpfsUploadResponse> {
    try {
      const client = this.createClient();
      const uploaded = await client.add({
        content: file.buffer,
      });
      return {
        cid: uploaded.cid.toString(),
      };
    } catch (err) {
      throw new IpfsError(WebErrorCodes.UploadFileError, err.message);
    }
  }
}
