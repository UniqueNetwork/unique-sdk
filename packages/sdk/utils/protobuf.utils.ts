import { Root, INamespace } from 'protobufjs';

export function serializeConstData(
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  payload: Record<string, any>,
  schema: INamespace,
): Uint8Array {
  const root = Root.fromJSON(schema);
  const NFTMeta = root.lookupType('onChainMetaData.NFTMeta');

  const transformedPayload = { ...NFTMeta.fromObject(payload) };

  const errMsg = NFTMeta.verify(transformedPayload);
  if (errMsg) throw Error(errMsg);

  const message = NFTMeta.create(transformedPayload);

  return Uint8Array.from(NFTMeta.encode(message).finish());
}

export const decodeConstData = (
  tokenConstData: Uint8Array,
  schema: INamespace,
  /* eslint-disable  @typescript-eslint/no-explicit-any */
): Record<string, any> => {
  const root = Root.fromJSON(schema);

  const NFTMeta = root.lookupType('onChainMetaData.NFTMeta');
  const parsedToken = NFTMeta.decode(tokenConstData);

  return NFTMeta.toObject(parsedToken, { enums: String });
};
