import { Injectable } from '@nestjs/common';
import { sdkFull } from '@unique-sdk/sdk-full';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: sdkFull() };
  }
}
