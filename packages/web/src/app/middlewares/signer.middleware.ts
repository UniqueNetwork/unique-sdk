/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SdkSigner } from '@unique-nft/sdk/extrinsics';
import { createSignerByAuthHead } from '../utils/signers';

export class SignerMiddleware implements NestMiddleware {
  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (authorization) {
      req.signer = createSignerByAuthHead(authorization);
    }
    next();
  }
}

declare global {
  namespace Express {
    interface Request {
      signer?: SdkSigner;
    }
  }
}
