import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { create } from 'ipfs-http-client';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'util';
import { fromBuffer as yauzlFromBuffer, ZipFile, Entry } from 'yauzl';
import { Readable as ReadableStream } from 'stream';

import { IpfsError } from '../../errors/ipfs-error';
import { WebErrorCodes } from '../../errors/codes';
import { IpfsUploadResponse } from '../../types/requests';
import { UploaderBase } from './UploaderBase';

const openZip = promisify<Buffer, object, ZipFile>(yauzlFromBuffer);

export class ZipUploader extends UploaderBase {
  protected static rootPath = 'files';

  protected readonly ipfsUploadZipDir: string;

  constructor(configService: ConfigService) {
    super(configService);
    this.ipfsUploadZipDir = configService.get('ipfsUploadZipDir');
  }

  public async uploadZip(zipFile): Promise<IpfsUploadResponse> {
    const contents = await this.readContentsFromZip(zipFile.buffer);
    const cid = await this.uploadIpfs(contents);
    return {
      cid,
    };
  }

  private async readContentsFromZip(buffer): Promise<any> {
    const zipfile = await openZip(buffer, { lazyEntries: true });
    const openReadStream = promisify(zipfile.openReadStream.bind(zipfile));
    let canceled: boolean;
    zipfile.readEntry();
    const contents = [];
    await new Promise((resolve, reject) => {
      zipfile.on('error', (err) => {
        canceled = true;
        reject(err);
      });

      zipfile.on('end', () => {
        if (!canceled) {
          resolve(contents);
        }
      });

      zipfile.on('entry', async (entry: Entry) => {
        if (canceled) {
          return;
        }
        if (entry.fileName.startsWith('__MACOSX/')) {
          zipfile.readEntry();
          return;
        }
        const stream: ReadableStream = await openReadStream(entry);
        const content = await ZipUploader.readStream(entry, stream);
        const mimeTypeSuccess = await this.checkFileMimeType(content);
        if (mimeTypeSuccess) {
          contents.push({
            path: `${ZipUploader.rootPath}/${entry.fileName}`,
            content,
          });
        }
        zipfile.readEntry();
      });
    });
    return contents;
  }

  private static async readStream(
    entry: Entry,
    stream: ReadableStream,
  ): Promise<Buffer> {
    return new Promise((resolve) => {
      const chunks = [];
      stream.on('readable', async () => {
        stream.read(entry.uncompressedSize);
      });
      stream.on('data', async (chunk) => {
        chunks.push(chunk);
      });
      stream.on('end', async () => {
        resolve(Buffer.concat(chunks));
      });
    });
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
