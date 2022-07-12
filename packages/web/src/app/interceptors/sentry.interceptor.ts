/* eslint-disable class-methods-use-this */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as Sentry from '@sentry/node';
import { Request } from 'express';

const getExtra = (context: ExecutionContext) => {
  const args = context.getArgs();
  if (!args.length) return {};
  const request: Request = args[0];
  return {
    request: {
      ip: request.ip,
      url: request.url,
      body: request.body,
      query: request.query,
      params: request.params,
      headers: request.headers,
      cookies: request.cookies,
    },
  };
};

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        Sentry.captureException(err, {
          extra: getExtra(context),
        });
        return throwError(err);
      }),
    );
  }
}
