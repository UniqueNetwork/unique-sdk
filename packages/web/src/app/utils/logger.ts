import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class AppLogger extends ConsoleLogger implements LoggerService {
  constructor(
    context: string,
    options?: {
      timestamp?: boolean;
    },
  ) {
    super(context, options);

    this.setLogLevels([]);
  }
}
