import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { create } from 'ipfs-http-client';
import { extname } from 'path';

import { IpfsError } from '../../errors/ipfs-error';
import { WebErrorCodes } from '../../errors/codes';
import { IpfsUploadResponse } from '../../types/requests';
import { UploaderBase } from './UploaderBase';

export class FileUploader extends UploaderBase {
  public async uploadFile(file): Promise<IpfsUploadResponse> {
    const mimeSuccess = await this.checkImageMimeType(file.buffer, {
      mime: file.mimetype,
      ext: extname(file.originalname).slice(1),
    });
    if (!mimeSuccess) {
      throw new IpfsError(WebErrorCodes.InvalidFiletype, 'Invalid filetype');
    }

    return this.upload(file);
  }

  private async upload(file): Promise<IpfsUploadResponse> {
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
      throw new IpfsError(WebErrorCodes.UploadFileError, err.message);
    }
  }
}
