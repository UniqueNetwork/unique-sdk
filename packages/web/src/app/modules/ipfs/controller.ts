import {
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpStatus,
  UsePipes,
  UseFilters,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { SdkValidationPipe } from '../../validation';
import { WebExceptionsFilter } from '../../utils/exception-filter';
import { IpfsUploadResponse } from '../../types/requests';
import { FileUploader } from './uploader/FileUploader';
import { ZipUploader } from './uploader/ZipUploader';

@UsePipes(SdkValidationPipe)
@UseFilters(WebExceptionsFilter)
@ApiTags('ipfs')
@Controller('ipfs')
export class IpfsController {
  private ipfsGatewayUrl: string;

  constructor(
    private readonly fileUploader: FileUploader,
    private readonly zipUploader: ZipUploader,
    configService: ConfigService,
  ) {
    this.ipfsGatewayUrl = configService.get('ipfsGatewayUrl');
  }

  private addFileUrl({ cid }: IpfsUploadResponse): IpfsUploadResponse {
    return {
      ...{ cid },
      ...(this.ipfsGatewayUrl
        ? { fileUrl: `${this.ipfsGatewayUrl}${cid}` }
        : {}),
    };
  }

  @Post('upload-file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: IpfsUploadResponse })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file,
    @Body() body,
    @Res({ passthrough: true }) response,
  ): Promise<IpfsUploadResponse> {
    const uploadResponse = await this.fileUploader.upload(file);
    return this.addFileUrl(uploadResponse);
  }

  @Post('upload-zip')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: IpfsUploadResponse })
  @UseInterceptors(FileInterceptor('file'))
  async uploadZip(
    @UploadedFile() file,
    @Body() body,
    @Res({ passthrough: true }) response,
  ): Promise<IpfsUploadResponse> {
    const uploadResponse = await this.zipUploader.upload(file);
    return this.addFileUrl(uploadResponse);
  }
}
