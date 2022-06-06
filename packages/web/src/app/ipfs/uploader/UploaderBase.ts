import { fromBuffer as fileTypeFromBuffer } from 'file-type';
import { ConfigService } from '@nestjs/config';

export class UploaderBase {
  protected readonly ipfsUploadUrl: string;

  protected readonly allowedImageTypes: string;

  protected readonly isHttpsUrl: boolean;

  constructor(configService: ConfigService) {
    this.ipfsUploadUrl = configService.get('ipfsUploadUrl');
    this.allowedImageTypes = configService.get('allowedImageTypes');
    this.isHttpsUrl = this.ipfsUploadUrl?.startsWith('https');
  }

  protected async checkImageMimeType(
    imageBuffer,
    extraMime = undefined,
  ): Promise<boolean> {
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
}
