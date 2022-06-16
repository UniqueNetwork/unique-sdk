import { ApiPromise } from '@polkadot/api';
import { SubmitResult, SubmitTxArguments } from '@unique-nft/sdk/types';
import { Observable, EMPTY } from 'rxjs';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { SubmitExtrinsicError } from '@unique-nft/sdk/errors';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { buildSignedSubmittable } from './submittable-utils';

export class Submitter {
  constructor(readonly api: ApiPromise) {}

  async submit(
    args: SubmitTxArguments,
    isObservable?: boolean,
  ): Promise<SubmitResult> {
    const submittable = buildSignedSubmittable(this.api, args);

    try {
      const hash = submittable.hash.toHex();

      if (!isObservable) {
        await submittable.send();

        return { hash, result$: EMPTY };
      }

      const result$ = Submitter.buildObservable(submittable);

      return { hash, result$ };
    } catch (error) {
      throw SubmitExtrinsicError.wrapError(error);
    }
  }

  private static buildObservable(
    submittable: SubmittableExtrinsic,
  ): Observable<ISubmittableResult> {
    return new Observable<ISubmittableResult>((subscriber) => {
      const stopWatching = submittable.send(
        (nextTxResult: ISubmittableResult) => {
          if (nextTxResult.isError || nextTxResult.dispatchError) {
            subscriber.error(nextTxResult);
          } else {
            subscriber.next(nextTxResult);
          }

          subscriber.next(nextTxResult);

          if (nextTxResult.isCompleted) {
            stopWatching.then((fn) => fn());
            subscriber.complete();
          }
        },
      );
    });
  }
}
