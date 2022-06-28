import { ApiBody, getSchemaPath } from '@nestjs/swagger';
import { SubmitTxBody, TxBuildBody } from '../../types/arguments';
import { UnsignedTxPayloadBody } from '../../types/sdk-methods';

export const CalculateFeeDocs = ApiBody({
  schema: {
    oneOf: [
      {
        $ref: getSchemaPath(TxBuildBody),
      },
      {
        $ref: getSchemaPath(UnsignedTxPayloadBody),
      },
      {
        $ref: getSchemaPath(SubmitTxBody),
      },
    ],
  },
  examples: {
    [TxBuildBody.name]: {
      summary: TxBuildBody.name,
      value: JSON.stringify({
        address: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
        section: 'balances',
        method: 'transfer',
        args: ['yGEYS1E6fu9YtECXbMFRf1faXRakk3XDLuD1wPzYb4oRWwRJK', 100000000],
      } as TxBuildBody),
    },
    [UnsignedTxPayloadBody.name]: {
      summary: UnsignedTxPayloadBody.name,
      value: JSON.stringify({
        signerPayloadJSON: {
          specVersion: '0x000e11e0',
          address: 'unekuudHD24JSZfCqQc7V1pbERSccgAdox55R3T9ELPeV5zkw',
          blockHash:
            '0xddeaa9d81c65e199cd56219aa6666689a761a018ef1afb88cb0b07b3427f85b2',
          blockNumber: '0x000129c8',
          era: '0x8400',
          genesisHash:
            '0xc1ccfbb7d6938d95e0dd507dc8f38846632996d8949a2f6bac705ffba6ba3892',
          method:
            '0x1e00005005b924a85aa096ed31f5ce56bcc9aff8e145335d6c7f65fb6c091784e282420284d717',
          nonce: '0x00000000',
          signedExtensions: [
            'CheckSpecVersion',
            'CheckGenesis',
            'CheckMortality',
            'CheckNonce',
            'CheckWeight',
            'ChargeTransactionPayment',
            'FakeTransactionFinalizer',
          ],
          tip: '0x00000000000000000000000000000000',
          transactionVersion: '0x00000001',
          version: 4,
        },
        signerPayloadRaw: {
          address: 'unekuudHD24JSZfCqQc7V1pbERSccgAdox55R3T9ELPeV5zkw',
          data: '0x1e00005005b924a85aa096ed31f5ce56bcc9aff8e145335d6c7f65fb6c091784e282420284d71784000000e0110e00c1ccfbb7d6938d95e0dd507dc8f38846632996d8949a2f6bac705ffba6ba3892ddeaa9d81c65e199cd56219aa6666689a761a018ef1afb88cb0b07b3427f85b2',
          type: 'payload',
        },
        signerPayloadHex:
          '0x1e00005005b924a85aa096ed31f5ce56bcc9aff8e145335d6c7f65fb6c091784e282420284d71784000000e0110e00c1ccfbb7d6938d95e0dd507dc8f38846632996d8949a2f6bac705ffba6ba3892ddeaa9d81c65e199cd56219aa6666689a761a018ef1afb88cb0b07b3427f85b2',
      } as UnsignedTxPayloadBody),
    },
    [SubmitTxBody.name]: {
      summary: SubmitTxBody.name,
      value: JSON.stringify({
        signerPayloadJSON: {
          specVersion: '0x000e11e0',
          address: 'unekuudHD24JSZfCqQc7V1pbERSccgAdox55R3T9ELPeV5zkw',
          blockHash:
            '0xddeaa9d81c65e199cd56219aa6666689a761a018ef1afb88cb0b07b3427f85b2',
          blockNumber: '0x000129c8',
          era: '0x8400',
          genesisHash:
            '0xc1ccfbb7d6938d95e0dd507dc8f38846632996d8949a2f6bac705ffba6ba3892',
          method:
            '0x1e00005005b924a85aa096ed31f5ce56bcc9aff8e145335d6c7f65fb6c091784e282420284d717',
          nonce: '0x00000000',
          signedExtensions: [
            'CheckSpecVersion',
            'CheckGenesis',
            'CheckMortality',
            'CheckNonce',
            'CheckWeight',
            'ChargeTransactionPayment',
            'FakeTransactionFinalizer',
          ],
          tip: '0x00000000000000000000000000000000',
          transactionVersion: '0x00000001',
          version: 4,
        },
        signature:
          '0x90f75be7d6e4fa7a415a5a86ba28c803d9bf4ce4072d6eb0f877705af0eaaa295c4244023af289bb8ed43647dbf27e38fb33a0c5ae192c370b2c5c0542712f8d',
      } as SubmitTxBody),
    },
  },
});
