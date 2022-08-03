import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import request from 'supertest';
import fs from 'fs';
import axios from 'axios';

import { createApp } from './utils.test';
import { WebErrorCodes } from '../src/app/errors/codes';
import { Config } from '../src/app/config/config.module';

describe('Ipfs upload', () => {
  let app: INestApplication;
  let config: ConfigService<Config>;
  let skipTests;

  beforeAll(async () => {
    app = await createApp();
    config = app.get(ConfigService);
    if (!config.get('ipfsUploadUrl')) {
      skipTests = true;
      console.log('skipped file upload test');
    }
  });

  describe('fail', () => {
    it('invalid payload', async () => {
      if (skipTests) return;

      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/ipfs/upload-file`)
        .set({
          'content-type': 'application/json',
        })
        .send();

      expect(ok).toBe(false);
      expect(body).toMatchObject({
        ok: false,
        error: {
          code: WebErrorCodes.InvalidPayload,
          message: 'Invalid payload',
        },
      });
    });

    it('invalid filetype', async () => {
      if (skipTests) return;

      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/ipfs/upload-file`)
        .attach('file', path.join(__dirname, '..', 'README.md'));

      expect(ok).toBe(false);
      expect(body).toMatchObject({
        ok: false,
        error: {
          code: WebErrorCodes.InvalidFiletype,
          message: 'Invalid filetype',
        },
      });
    });
  });

  describe('ok upload', () => {
    const downloadDir = '../../tmp/download-test';
    const dataDir = path.join(__dirname, 'data');
    const punk1FilePath = path.join(dataDir, 'punk-1.png');
    const zipFilePath = path.join(dataDir, 'punks.zip');
    beforeAll(async () => {
      await fs.promises.mkdir(downloadDir, { recursive: true });
    });

    async function downloadFileTest(
      fileUrl: string,
      originalFilePath: string,
    ): Promise<void> {
      const rnd = Math.floor(Math.random() * 1_000_000);
      const outputLocationPath = `${downloadDir}/file-${rnd}`;
      const writer = fs.createWriteStream(outputLocationPath);
      await axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
      }).then((response) => response.data.pipe(writer));

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const statsDownloaded = await fs.promises.stat(outputLocationPath);
      const statsOriginal = await fs.promises.stat(originalFilePath);
      expect(statsDownloaded.size).toBe(statsOriginal.size);

      await fs.promises.unlink(outputLocationPath);
    }

    it('file', async () => {
      if (skipTests) return;

      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/ipfs/upload-file`)
        .attach('file', punk1FilePath);

      expect(body).toEqual(
        expect.objectContaining({
          cid: expect.any(String),
        }),
      );

      expect(ok).toBe(true);

      if (!config.get('ipfsGatewayUrl')) return;
      const downloadUrl = body.fileUrl;
      console.log('downloadUrl', downloadUrl);
      await downloadFileTest(downloadUrl, punk1FilePath);
    });

    it('zip', async () => {
      if (skipTests) return;

      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/ipfs/upload-zip`)
        .attach('file', zipFilePath);

      expect(body).toEqual(
        expect.objectContaining({
          cid: expect.any(String),
        }),
      );

      expect(ok).toBe(true);

      if (!config.get('ipfsGatewayUrl')) return;
      const downloadUrl = `${body.fileUrl}/punk-1.png`;
      console.log('downloadUrl', downloadUrl);
      await downloadFileTest(downloadUrl, punk1FilePath);
    });

    it('existence fileUrl property', async () => {
      if (skipTests || !config.get('ipfsGatewayUrl')) return;

      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/ipfs/upload-file`)
        .attach('file', punk1FilePath);

      expect(body).toMatchObject({
        cid: expect.any(String),
        fileUrl: expect.any(String),
      });
      expect(ok).toBe(true);
    });

    it('none fileUrl property', async () => {
      if (skipTests) return;

      process.env.IPFS_GATEWAY_URL = '';
      app = await createApp();
      config = app.get(ConfigService);

      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/ipfs/upload-file`)
        .attach('file', punk1FilePath);

      expect(body).toMatchObject({
        cid: expect.any(String),
      });
      expect(ok).toBe(true);
    });
  });
});
