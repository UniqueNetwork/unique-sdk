import { promises as fs } from 'fs';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { create } from 'ipfs-http-client';
import * as path from 'path';
import ExtractZip from 'extract-zip';
import { ConfigService } from '@nestjs/config';

import { IpfsError } from '../../errors/ipfs-error';
import { WebErrorCodes } from '../../errors/codes';
import { IpfsUploadResponse } from '../../types/requests';
import { TempDirInfo } from './types';
import { UploaderBase } from './UploaderBase';

export class ZipUploader extends UploaderBase {
  protected static rootPath = 'files';

  protected readonly ipfsUploadZipDir: string;

  constructor(configService: ConfigService) {
    super(configService);
    this.ipfsUploadZipDir = configService.get('ipfsUploadZipDir');
  }

  public async uploadZip(zipFile): Promise<IpfsUploadResponse> {
    const tempInfo = await this.createTempDir();
    const files = await ZipUploader.extractZip(tempInfo, zipFile);
    const contents = await this.loadFiles(tempInfo, files);
    const cid = await this.uploadIpfs(contents);
    await fs.rm(tempInfo.rootDir, { recursive: true });
    return {
      cid,
    };
  }

  private async createTempDir(): Promise<TempDirInfo> {
    const rnd = Math.floor(Math.random() * 1_000_000);
    const rootDir = path.join(this.ipfsUploadZipDir, `${Date.now()}_${rnd}`);
    const zipFile = path.join(rootDir, 'data.zip');
    const filesDir = path.join(rootDir, 'files');
    await fs.mkdir(filesDir, { recursive: true });
    return {
      rootDir,
      zipFile,
      filesDir,
    };
  }

  private static async extractZip(
    tempInfo: TempDirInfo,
    zipFile,
  ): Promise<string[]> {
    await fs.writeFile(tempInfo.zipFile, zipFile.buffer);
    try {
      await ExtractZip(tempInfo.zipFile, { dir: tempInfo.filesDir });
    } catch (err) {
      throw new IpfsError(WebErrorCodes.UploadFileError, err.message);
    }
    return fs.readdir(tempInfo.filesDir);
  }

  private async loadFiles(
    tempInfo: TempDirInfo,
    files: string[],
  ): Promise<any[]> {
    const contents = await Promise.all(
      files.map(async (fileName) => {
        const content = await fs.readFile(`${tempInfo.filesDir}/${fileName}`);
        return {
          path: `${ZipUploader.rootPath}/${fileName}`,
          content,
        };
      }),
    );
    const filteredContent = contents.filter((item) =>
      this.checkFileMimeType(item.content),
    );
    if (!filteredContent.length) {
      throw new IpfsError(
        WebErrorCodes.UploadFileError,
        'No files in zip archive',
      );
    }
    return filteredContent;
  }

  private async uploadIpfs(contents: any[]): Promise<string> {
    const addedFiles = [];
    try {
      const client = create({
        url: this.ipfsUploadUrl,
        agent: this.isHttpsUrl ? new HttpsAgent() : new HttpAgent(),
      });

      const files = client.addAll(contents, {
        fileImportConcurrency: 50,
      });
      // eslint-disable-next-line
      for await (const file of files) {
        addedFiles.push({
          cid: file.cid.toString(),
          path: file.path,
          size: file.size,
        });
      }
    } catch (err) {
      throw new IpfsError(WebErrorCodes.UploadFileError, err.message);
    }

    const rootItem = addedFiles.find(
      (item) => item.path === ZipUploader.rootPath,
    );
    if (!rootItem) {
      throw new IpfsError(WebErrorCodes.UploadFileError, 'Root cid not found');
    }
    return rootItem.cid;
  }
}
