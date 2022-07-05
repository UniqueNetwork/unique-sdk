import { Root, Type, IField, INamespace } from 'protobufjs';
import { ValidationError } from '@unique-nft/sdk/errors';
import { encodeToken } from './encode-token';

export const validateOnChainSchema = (constOnChainSchema: INamespace) => {
  let root: Root;
  try {
    root = Root.fromJSON(constOnChainSchema);
  } catch (err) {
    throw ValidationError.wrapError(err);
  }

  let nftMetaType: Type;
  try {
    nftMetaType = root.lookupType('NFTMeta');
  } catch (err) {
    throw ValidationError.wrapError(err);
  }

  const idsContainer: Record<string, boolean> = {};

  const payload: Record<string, any> = {};
  Object.keys(nftMetaType.fields).forEach((name) => {
    const field: IField = nftMetaType.fields[name];

    const { id } = field;

    if (idsContainer[id]) {
      throw new ValidationError(
        `The "id" property in fields list must be unique`,
        { field },
      );
    }
    idsContainer[id] = true;

    if (field.type === 'string') {
      payload[name] = 'test';
      if (
        field.rule &&
        field.rule !== 'required' &&
        field.rule !== 'optional'
      ) {
        throw new ValidationError(`Invalid rule in string field`, { field });
      }
    } else {
      payload[name] = 0;
      try {
        root.lookupEnum(name);
      } catch (err) {
        throw ValidationError.wrapError(err);
      }
    }
  });

  try {
    encodeToken(payload, constOnChainSchema);
  } catch (err) {
    throw ValidationError.wrapError(err);
  }
};
