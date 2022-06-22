import { fromBuffer as fileTypeFromBuffer } from 'file-type';
import { ConfigService } from '@nestjs/config';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { Agent as HttpsAgent } from 'https';
import { Agent as HttpAgent } from 'http';

export class IpfsUploader {
  private readonly ipfsUploadUrl: string =
    this.configService.get('ipfsUploadUrl');

  protected readonly ipfsGatewayUrl: string =
    this.configService.get('ipfsGatewayUrl');

  private readonly allowedTypes: string =
    this.configService.get('allowedTypes');

  private readonly isHttpsUrl: boolean =
    this.ipfsUploadUrl?.startsWith('https');

  constructor(private configService: ConfigService) {}

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
