import {
  Injectable,
  PipeTransform,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationError } from '@unique-nft/sdk/errors';

@Injectable()
export class CustomValidationPipe
  extends ValidationPipe
  implements PipeTransform<any>
{
  constructor(options: ValidationPipeOptions) {
    super({
      ...options,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => Promise.resolve(new ValidationError(errors)),
    });
  }
}
