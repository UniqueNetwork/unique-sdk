import { ConfigModule } from '@nestjs/config';
import * as process from 'process';

export type Config = {
  isProduction: boolean;
  port: number;
  chainWsUrl: string;
  ipfsGatewayUrl: string;
  prefix: string;
  swagger: string;
  signer?: SignerConfig;
};

export type SignerConfig = {
  seed?: string;
};

const loadConfig = (): Config => ({
  isProduction: process.env.NODE_ENV !== 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  chainWsUrl: process.env.CHAIN_WS_URL || 'wss://ws-quartz-dev.comecord.com',
  prefix: process.env.PREFIX || '',
  swagger: process.env.SWAGGER || 'swagger',
  ipfsGatewayUrl:
    process.env.IPFS_GATEWAY_URL || 'https://ipfs.unique.network/ipfs/',
  signer: {
    seed: process.env.SIGNER_SEED || undefined,
  },
});

export const GlobalConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [loadConfig],
});
