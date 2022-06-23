export interface QueryMethod<A, R> {
  (args: A): Promise<R | null>;
}
