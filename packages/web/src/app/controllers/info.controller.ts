import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@Controller('')
export class InfoController {
  private readonly swaggerPath: string;

  constructor(configService: ConfigService) {
    this.swaggerPath = configService.get('swagger');
  }

  @ApiExcludeEndpoint()
  @Get('')
  @HttpCode(HttpStatus.I_AM_A_TEAPOT)
  getInfo(): object {
    return {
      Welcome: 'to Unique Network, please use Swagger to dive into endpoints info',
      swagger: `/${this.swaggerPath}`,
      'github repository': 'https://github.com/UniqueNetwork/unique-sdk/tree/master/packages/web',
    };
  }
}
