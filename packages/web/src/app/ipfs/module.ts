import { Module, DynamicModule } from '@nestjs/common';
import { GlobalConfigModule } from '../config/config.module';
import { IpfsService } from './service';
import { IpfsController } from './controller';

@Module({})
export class IpfsModule {
  static register(): DynamicModule {
    return {
      module: IpfsModule,
      imports: [GlobalConfigModule],
      controllers: [IpfsController],
      providers: [IpfsService],
    };
  }
}
