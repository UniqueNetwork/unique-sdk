## Thin client

### install
npm i @unique-nft/thin-client

### Initialization in Node.js
import { Client } from '@unique-nft/thin-client';

const client = new Client('http://localhost:3000/', '//Alice');

### Initialization in browser

### balance
await client.balance.get(aliceAddress);

await client.balance.transfer(
  aliceAddress,
  bobAddress,
  0.001,
  true,
);

### collection
await client.collection.get(collectionId);
