import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { fromBuffer as fileTypeFromBuffer } from 'file-type';
import { create } from 'ipfs-http-client';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { extname } from 'path';

import { ImageUploadError } from '../errors/image-upload-error';
import { WebErrorCodes } from '../errors/codes';
import { ImageUploadResponse } from '../types/requests';

@Injectable()
export class ImageService {
  private readonly ipfsUploadUrl: string;

  private readonly allowedImageTypes: string;

  private readonly isHttpsUrl: boolean;

  constructor(private configService: ConfigService) {
    this.ipfsUploadUrl = configService.get('ipfsUploadUrl');
    this.allowedImageTypes = configService.get('allowedImageTypes');
    this.isHttpsUrl = this.ipfsUploadUrl.startsWith('https');
  }

  private async checkImageMimeType(imageBuffer, extraMime): Promise<boolean> {
    let typeResult;
    try {
      typeResult = await fileTypeFromBuffer(imageBuffer);
    } catch (e) {
      return false;
    }
    if (!typeResult && extraMime) {
      typeResult = extraMime;
    }
    if (!typeResult) return false;
    return this.allowedImageTypes.indexOf(typeResult.mime) >= 0;
  }

  public async uploadFile(file): Promise<ImageUploadResponse> {
    if (!file) {
      throw new ImageUploadError(
        WebErrorCodes.InvalidPayload,
        'Invalid image payload',
      );
    }

    const mimeSuccess = await this.checkImageMimeType(file.buffer, {
      mime: file.mimetype,
      ext: extname(file.originalname).slice(1),
    });
    if (!mimeSuccess) {
      throw new ImageUploadError(
        WebErrorCodes.InvalidFiletype,
        'Invalid filetype',
      );
    }

    try {
      const client = create({
        url: this.ipfsUploadUrl,
        agent: this.isHttpsUrl ? new HttpsAgent() : new HttpAgent(),
      });
      const uploaded = await client.add({
        content: file.buffer,
      });
      return {
        cid: uploaded.cid.toString(),
      };
    } catch (e) {
      throw new ImageUploadError(
        WebErrorCodes.UploadImageError,
        'Failed to upload image',
      );
    }
  }
}
