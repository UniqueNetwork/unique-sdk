import {
  AttributeSchema as AttributeSchemaOriginal,
  AttributeType,
  AttributeKind,
} from '@unique-nft/api';

import { AttributeTypeName, AttributeKindName, AttributeSchema } from './types';

type WithOriginal = {
  attributesSchema: Record<number, AttributeSchemaOriginal>;
};

type WithHuman = { attributesSchema: Record<number, AttributeSchema> };

export class AttributesTransformer {
  private static attributeToOriginal(
    attributeSchema: AttributeSchema,
  ): AttributeSchemaOriginal {
    return {
      ...attributeSchema,
      kind: AttributeKind[attributeSchema.kind],
      type: AttributeType[attributeSchema.type],
    };
  }

  private static attributeToHuman(
    attributeSchema: AttributeSchemaOriginal,
  ): AttributeSchema {
    return {
      ...attributeSchema,
      kind: AttributeKind[attributeSchema.kind] as AttributeKindName,
      type: AttributeType[attributeSchema.type] as AttributeTypeName,
    };
  }

  static toHuman<T extends WithOriginal>(schema: T): T & WithHuman {
    const attributes = Object.entries(schema.attributesSchema).map(
      ([key, attributeSchema]) => [
        key,
        AttributesTransformer.attributeToHuman(attributeSchema),
      ],
    );

    return {
      ...schema,
      attributesSchema: Object.fromEntries(attributes),
    };
  }

  static toOriginal<T extends WithHuman>(schema: T): T & WithOriginal {
    const attributes = Object.entries(schema.attributesSchema).map(
      ([key, attributeSchema]) => [
        key,
        AttributesTransformer.attributeToOriginal(attributeSchema),
      ],
    );

    return {
      ...schema,
      attributesSchema: Object.fromEntries(attributes),
    };
  }
}
