import { ThinClient } from '../index';

export abstract class Section {
  abstract readonly path: string;

  abstract readonly baseUrl: string;

  constructor(public readonly client: ThinClient) {}
}
