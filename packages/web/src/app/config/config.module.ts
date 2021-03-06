import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { CacheConfig, createCacheConfig } from './cache.config';

export type Config = {
  environment: string;
  port: number;
  chainWsUrl: string;
  ipfsGatewayUrl: string;
  prefix: string;
  swagger: string;
  signer?: SignerConfig;

  ipfsUploadUrl: string;
  allowedTypes: Array<string>;

  cache: CacheConfig;

  secondary: {
    chainWsUrl?: string;
    name?: string;
    signer?: SignerConfig;
  };

  sentryDsnUrl?: string;
};

export type SignerConfig = {
  seed?: string;
};

const loadConfig = (): Config => ({
  environment: process.env.ENVIRONMENT || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  chainWsUrl: process.env.CHAIN_WS_URL,
  prefix: process.env.PREFIX || '',
  swagger: process.env.SWAGGER || 'swagger',
  ipfsGatewayUrl: process.env.IPFS_GATEWAY_URL,
  signer: {
    seed: process.env.SIGNER_SEED,
  },

  ipfsUploadUrl: process.env.IPFS_UPLOAD_URL,
  allowedTypes: process.env.ALLOWED_TYPES
    ? process.env.ALLOWED_TYPES.split(',')
    : [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'text/json',
        'application/json',
      ],

  secondary: {
    chainWsUrl: process.env.SECONDARY_CHAIN_WS_URL || undefined,
    name: process.env.SECONDARY_CHAIN_NAME || undefined,
  },

  cache: createCacheConfig(process.env),

  sentryDsnUrl: process.env.SENTRY_DSN_URL,
});

export const GlobalConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [loadConfig],
});
