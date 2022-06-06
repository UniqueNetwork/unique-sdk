import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import request from 'supertest';
import fs from 'fs';
import axios from 'axios';

import { createApp } from './utils.test';
import { WebErrorCodes } from '../src/app/errors/codes';
import { Config } from '../src/app/config/config.module';

describe('Images upload', () => {
  let app: INestApplication;
  let config: ConfigService<Config>;
  let skipTests;

  beforeAll(async () => {
    app = await createApp();
    config = app.get(ConfigService);
    if (!config.get('ipfsUploadUrl')) {
      skipTests = true;
      console.log('skipped image upload test');
    }
  });

  describe('fail', () => {
    it('invalid payload', async () => {
      if (skipTests) return;

      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/ipfs/upload`)
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
        .post(`/api/ipfs/upload`)
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
      jest.setTimeout(60000);
      await fs.promises.mkdir(downloadDir, { recursive: true });
    });

    async function downloadFileTest(
      fileUrl: string,
      originalFilePath: string,
    ): Promise<any> {
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

    it('image', async () => {
      if (skipTests) return;

      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/ipfs/upload`)
        .attach('file', punk1FilePath);

      expect(body).toMatchObject({
        cid: expect.any(String),
      });
      expect(ok).toBe(true);

      const downloadUrl = `https://ipfs.io/ipfs/${body.cid}`;
      await downloadFileTest(downloadUrl, punk1FilePath);
    });

    it('zip', async () => {
      if (skipTests) return;
      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/ipfs/upload`)
        .attach('file', zipFilePath);

      expect(body).toMatchObject({
        cid: expect.any(String),
      });
      expect(ok).toBe(true);

      const downloadUrl = `https://ipfs.io/ipfs/${body.cid}/punk-1.png`;
      await downloadFileTest(downloadUrl, punk1FilePath);
    });
  });
});
