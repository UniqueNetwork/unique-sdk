import { Module, DynamicModule } from '@nestjs/common';
import { GlobalConfigModule } from '../config/config.module';
import { IpfsService } from './service';
import { IpfsController } from './controller';

@Module({})
export class IpfsModule {
  static register(): DynamicModule {
    if (!process.env.IPFS_UPLOAD_URL) {
      return {
        module: IpfsModule,
        imports: [],
        controllers: [],
        providers: [],
      };
    }
    return {
      module: IpfsModule,
      imports: [GlobalConfigModule],
      controllers: [IpfsController],
      providers: [IpfsService],
    };
  }
}
