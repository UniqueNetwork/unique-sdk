import { promises as fs } from 'fs';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { create } from 'ipfs-http-client';
import * as path from 'path';
import ExtractZip from 'extract-zip';

import { ImageUploadError } from '../../errors/image-upload-error';
import { WebErrorCodes } from '../../errors/codes';
import { ImageUploadResponse } from '../../types/requests';
import { TempDirInfo } from './types';
import { UploaderBase } from './UploaderBase';

export class ZipUploader extends UploaderBase {
  public async uploadZip(zipFile): Promise<ImageUploadResponse> {
    const tempInfo = await this.createTempDir();
    const files = await ZipUploader.extractZip(tempInfo, zipFile);
    const contents = await this.loadFiles(tempInfo, files);
    const cid = await this.uploadIpfs(contents);
    await fs.rmdir(tempInfo.rootDir, { recursive: true });
    return {
      cid,
    };
  }

  private async createTempDir(): Promise<TempDirInfo> {
    const rnd = Math.floor(Math.random() * 1_000_000);
    const rootDir = path.join(this.ipfsUploadZipDir, `${Date.now()}_${rnd}`);
    const zipFile = path.join(rootDir, 'data.zip');
    const imagesDir = path.join(rootDir, 'images');
    await fs.mkdir(imagesDir, { recursive: true });
    return {
      rootDir,
      zipFile,
      imagesDir,
    };
  }

  private static async extractZip(
    tempInfo: TempDirInfo,
    zipFile,
  ): Promise<string[]> {
    await fs.writeFile(tempInfo.zipFile, zipFile.buffer);
    try {
      await ExtractZip(tempInfo.zipFile, { dir: tempInfo.imagesDir });
    } catch (err) {
      throw new ImageUploadError(WebErrorCodes.UploadImageError, err.message);
    }
    return fs.readdir(tempInfo.imagesDir);
  }

  private async loadFiles(
    tempInfo: TempDirInfo,
    files: string[],
  ): Promise<any[]> {
    const contents = await Promise.all(
      files.map(async (fileName) => {
        const content = await fs.readFile(`${tempInfo.imagesDir}/${fileName}`);
        return {
          path: `${ZipUploader.rootPath}/${fileName}`,
          content,
        };
      }),
    );
    const filteredContent = contents.filter((item) =>
      this.checkImageMimeType(item.content),
    );
    if (!filteredContent.length) {
      throw new ImageUploadError(
        WebErrorCodes.UploadImageError,
        'No images in zip archive',
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
      throw new ImageUploadError(WebErrorCodes.UploadImageError, err.message);
    }

    const rootItem = addedFiles.find(
      (item) => item.path === ZipUploader.rootPath,
    );
    if (!rootItem) {
      throw new ImageUploadError(
        WebErrorCodes.UploadImageError,
        'Root cid not found',
      );
    }
    return rootItem.cid;
  }
}
