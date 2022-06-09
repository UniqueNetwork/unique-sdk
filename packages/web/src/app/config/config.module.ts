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

  ipfsUploadUrl: string;
  allowedTypes: Array<string>;
};

export type SignerConfig = {
  seed?: string;
};

const loadConfig = (): Config => ({
  isProduction: process.env.NODE_ENV !== 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  chainWsUrl: process.env.CHAIN_WS_URL,
  prefix: process.env.PREFIX || '',
  swagger: process.env.SWAGGER || 'swagger',
  ipfsGatewayUrl: process.env.IPFS_GATEWAY_URL,
  signer: {
    seed: process.env.SIGNER_SEED || undefined,
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
});

export const GlobalConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [loadConfig],
});
