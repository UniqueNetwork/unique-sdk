import { Module, DynamicModule } from '@nestjs/common';
import { GlobalConfigModule } from '../config/config.module';
import { IpfsController } from './controller';
import { FileUploader } from './uploader/FileUploader';
import { ZipUploader } from './uploader/ZipUploader';

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
      providers: [FileUploader, ZipUploader],
    };
  }
}
