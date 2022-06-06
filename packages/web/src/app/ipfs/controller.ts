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

import { IpfsService } from './service';
import { SdkValidationPipe } from '../validation';
import { WebExceptionsFilter } from '../utils/exception-filter';
import { ImageUploadResponse } from '../types/requests';

@UsePipes(SdkValidationPipe)
@UseFilters(WebExceptionsFilter)
@ApiTags('ipfs')
@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Post('upload')
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
  @ApiResponse({ status: HttpStatus.CREATED, type: ImageUploadResponse })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file,
    @Body() body,
    @Res({ passthrough: true }) response,
  ): Promise<ImageUploadResponse> {
    return this.ipfsService.uploadFile(file);
  }
}
