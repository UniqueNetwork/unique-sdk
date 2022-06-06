import { fromBuffer as fileTypeFromBuffer } from 'file-type';
import { ConfigService } from '@nestjs/config';

export class UploaderBase {
  protected readonly ipfsUploadUrl: string;

  protected readonly allowedTypes: string;

  protected readonly isHttpsUrl: boolean;

  constructor(configService: ConfigService) {
    this.ipfsUploadUrl = configService.get('ipfsUploadUrl');
    this.allowedTypes = configService.get('allowedTypes');
    this.isHttpsUrl = this.ipfsUploadUrl?.startsWith('https');
  }

  protected async checkImageMimeType(
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
