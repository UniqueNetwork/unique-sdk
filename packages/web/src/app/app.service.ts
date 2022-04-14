import { Injectable } from '@nestjs/common';
import { sdk } from '@unique-nft/sdk';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: sdk() };
  }
}
