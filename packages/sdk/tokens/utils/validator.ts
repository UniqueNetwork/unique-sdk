import { Root, Type, IField, INamespace } from 'protobufjs';
import { ValidationError } from '@unique-nft/sdk/errors';

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
      if (
        field.rule &&
        field.rule !== 'required' &&
        field.rule !== 'optional'
      ) {
        throw new ValidationError(`Invalid rule in string field`, { field });
      }
    } else {
      try {
        root.lookupEnum(name);
      } catch (err) {
        throw ValidationError.wrapError(err);
      }
    }
  });
};
