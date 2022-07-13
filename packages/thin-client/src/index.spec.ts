import { createSigner, SdkSigner } from '@unique-nft/accounts/sign';

import { ThinClient } from './index';
import { SignerPayloadJSONDto } from './types/Api';
import { objectToCamel } from 'ipfs-http-client/types/src/lib/object-to-camel';

const baseUrl = 'http://localhost:3000';

const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
const aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

describe('balance', () => {
  it('transfer', async () => {
    const client = new ThinClient({ url: baseUrl }, 1);
    const response: object = await client.balance.transfer.build({
      address: bobAddress,
      destination: aliceAddress,
      amount: 0.00001,
    });
    expect(response).toEqual(expect.any(Object));
  }, 60_000);

  it('sign', async () => {
    const client = new ThinClient({ url: baseUrl }, 1);
    const response: object = await client.balance.transfer.sign({
      address: bobAddress,
      destination: aliceAddress,
      amount: 0.00001,
    });
    expect(response).toEqual(expect.any(Object));
  }, 60_000);

  it('submitWaitResult', async () => {
    const client = new ThinClient({ url: baseUrl }, 1);
    const response: object = await client.balance.transfer.submitWaitResult({
      address: bobAddress,
      destination: aliceAddress,
      amount: 0.00001,
    });
    expect(response).toEqual(expect.any(Object));
  }, 60_000);
});

it('check balance changes', async () => {
  const client = new ThinClient({ url: baseUrl }, 1);
  const initBalanceResponse = await client.balance.get({ address: bobAddress });
  const transferResponse = await client.balance.transfer.submitWaitResult({
    address: bobAddress,
    destination: aliceAddress,
    amount: 0.00001,
  });
  const currentBalanceResponse = await client.balance.get({
    address: bobAddress,
  });
  expect(initBalanceResponse.availableBalance.raw).not.toBe(
    currentBalanceResponse.availableBalance.raw,
  );
}, 60_000);

it('sign', async () => {
  const signer: SdkSigner = await createSigner({ seed: '//Bob' });
  const client = new ThinClient({ url: baseUrl }, signer);
  const response = await client.balance.transfer.sign({
    address: bobAddress,
    destination: aliceAddress,
    amount: 0.00001,
  });
  expect(response).toEqual(expect.any(Object));
  expect(response).toMatchObject({
    signerPayloadJSON: expect.any(Object),
    signature: expect.any(String),
  });
}, 60_000);
