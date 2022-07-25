type This = typeof globalThis;
export interface InjectedWindow extends This {
  ethereum: {
    request: (o: { method: string }) => Promise<Array<string>>;
  };
}
export const win = window as Window & InjectedWindow;
