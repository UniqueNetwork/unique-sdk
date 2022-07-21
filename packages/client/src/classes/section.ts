import { IClient } from '../types/interfaces';

export abstract class Section {
  abstract readonly path: string;

  abstract readonly baseUrl: string;

  constructor(public readonly client: IClient) {}
}
