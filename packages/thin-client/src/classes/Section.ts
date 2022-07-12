import { ThinClient } from '../index';

export abstract class Section {
  abstract readonly path: string;

  constructor(public readonly client: ThinClient) {}
}
