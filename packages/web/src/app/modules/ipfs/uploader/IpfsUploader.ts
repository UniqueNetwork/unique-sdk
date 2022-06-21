import { fromBuffer as fileTypeFromBuffer } from 'file-type';
import { ConfigService } from '@nestjs/config';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { Agent as HttpsAgent } from 'https';
import { Agent as HttpAgent } from 'http';

export class IpfsUploader {
  private ipfsUploadUrl: string;

  private allowedTypes: string;

  private isHttpsUrl: boolean;

  protected init(configService: ConfigService) {
    this.ipfsUploadUrl = configService.get('ipfsUploadUrl');
    this.allowedTypes = configService.get('allowedTypes');
    this.isHttpsUrl = this.ipfsUploadUrl?.startsWith('https');
  }

  protected createClient(): IPFSHTTPClient {
    return create({
      url: this.ipfsUploadUrl,
      agent: this.isHttpsUrl ? new HttpsAgent() : new HttpAgent(),
    });
  }

  protected async isAllowMimeType(
    fileBuffer,
    extraMime = undefined,
  ): Promise<boolean> {
    let typeResult;
    try {
      typeResult = await fileTypeFromBuffer(fileBuffer);
    } catch (e) {
      return false;
    }
    if (!typeResult && extraMime) {
      typeResult = extraMime;
    }
    if (!typeResult) return false;
    return this.allowedTypes.indexOf(typeResult.mime) >= 0;
  }
}
