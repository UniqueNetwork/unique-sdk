/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
import { Injectable, Scope, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createSignerByAuthorizationHead } from '@unique-nft/sdk/sign';

@Injectable({ scope: Scope.REQUEST })
export class SignerMiddleware implements NestMiddleware {
  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    req.body.signer = authorization
      ? createSignerByAuthorizationHead(authorization)
      : null;
    next();
  }
}
