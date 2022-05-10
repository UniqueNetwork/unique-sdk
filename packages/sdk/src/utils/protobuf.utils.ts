import { Root, INamespace, Enum } from 'protobufjs';

export function serializeConstData(
  payload: Record<string, any>,
  schema: INamespace,
): Uint8Array {
  const root = Root.fromJSON(schema);
  const NFTMeta = root.lookupType('onChainMetaData.NFTMeta');

  const errMsg = NFTMeta.verify(payload);

  if (errMsg) {
    throw Error(errMsg);
  }

  const message = NFTMeta.create(payload);

  return Uint8Array.from(NFTMeta.encode(message).finish());
}

export const decodeConstData = (
  tokenConstData: Uint8Array,
  schema: INamespace,
): Record<string, any> => {
  const root = Root.fromJSON(schema);

  const NFTMeta = root.lookupType('onChainMetaData.NFTMeta');
  const parsedToken = NFTMeta.decode(tokenConstData).toJSON();

  Object.keys(parsedToken).forEach((field) => {
    let existingEnum: Enum | null = null;
    try {
      existingEnum = root.lookupEnum(field);
    } catch (e) {
      // do nothing
    }

    if (existingEnum) {
      parsedToken[field] = existingEnum.getOption(parsedToken[field]);
    }
  });

  return parsedToken;
};
