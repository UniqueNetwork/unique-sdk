import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Signer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.signer;
  },
);
