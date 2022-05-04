import { ConfigModule } from '@nestjs/config';

export type Config = {
  isProduction: boolean;
  port: number;
  chainWsUrl: string;
  prefix: string;
  swagger: string;
};

const loadConfig = (): Config => ({
  isProduction: process.env.NODE_ENV !== 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  chainWsUrl: process.env.CHAIN_WS_URL || 'wss://ws-quartz-dev.comecord.com',
  prefix: process.env.PREFIX || '',
  swagger: process.env.SWAGGER || 'swagger',
});

export const GlobalConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [loadConfig],
});
