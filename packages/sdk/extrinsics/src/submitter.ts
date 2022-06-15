import { ApiPromise } from '@polkadot/api';
import { SubmitResult, SubmitTxArguments } from '@unique-nft/sdk/types';
import { buildSignedSubmittable } from '@unique-nft/sdk/extrinsics/src/submittable-utils';
import { Observable, Subject, EMPTY } from 'rxjs';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { SubmitExtrinsicError } from '@unique-nft/sdk/errors';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

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

      const result$ = await this.buildObservable(submittable);

      return { hash, result$ };
    } catch (error) {
      throw SubmitExtrinsicError.wrapError(error);
    }
  }

  private async buildObservable(
    submittable: SubmittableExtrinsic,
  ): Promise<Observable<ISubmittableResult>> {
    const resultSubject = new Subject<ISubmittableResult>();

    const stopWatching = await submittable.send(
      (nextTxResult: ISubmittableResult) => {
        if (nextTxResult.isError || nextTxResult.dispatchError) {
          resultSubject.error(nextTxResult);
        } else {
          resultSubject.next(nextTxResult);
        }

        resultSubject.next(nextTxResult);

        if (nextTxResult.isCompleted) {
          stopWatching();
          resultSubject.complete();
        }
      },
    );

    return resultSubject.asObservable();
  }
}
