import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { create } from 'ipfs-http-client';
import { extname } from 'path';

import { ImageUploadError } from '../../errors/image-upload-error';
import { WebErrorCodes } from '../../errors/codes';
import { ImageUploadResponse } from '../../types/requests';
import { UploaderBase } from './UploaderBase';

export class ImageUploader extends UploaderBase {
  public async uploadFile(file): Promise<ImageUploadResponse> {
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

    return this.uploadImage(file);
  }

  private async uploadImage(file): Promise<ImageUploadResponse> {
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
    } catch (err) {
      throw new ImageUploadError(WebErrorCodes.UploadImageError, err.message);
    }
  }
}
