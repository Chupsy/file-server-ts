import path from 'path';
import { promises as fs } from 'fs';
import { S3 } from 'aws-sdk';
import File, { FileWithData } from '@domain/file';
import { FilePersister } from '../file_persister_abstract';
import { FileNotFoundError } from '@helpers/errors/file_not_found.exception';

export interface AWSS3FilePersisterConfig {
  defaultBucketName: string;
  aws_access_key_id: string;
  aws_secret_access_key: string;
}

export class AWSS3FilePersister extends FilePersister<AWSS3FilePersisterConfig> {
  private s3: S3;

  constructor(config: AWSS3FilePersisterConfig) {
    super('AWSS3FilePersister', config);
    this.s3 = new S3({
      accessKeyId: config.aws_access_key_id,
      secretAccessKey: config.aws_secret_access_key,
    });
  }

  async saveFile(file: FileWithData): Promise<FileWithData> {
    if (!file.data) {
      throw new Error('no data in file');
    }
    const params = {
      Bucket: this.config.defaultBucketName,
      Key: file.id!,
      Body: file.data,
    };

    try {
      const res = await this.s3.upload(params).promise();

      this.logInfo('File Uploaded with Successfull', res.Location);

      return file;
    } catch (error) {
      throw new Error('Failed to save file: ' + error);
    }
  }

  async getFile(file: File): Promise<FileWithData> {
    const params = {
      Bucket: this.config.defaultBucketName,
      Key: file.id!,
    };

    try {
      const fileWithData = new FileWithData(file);
      const result = await this.s3.getObject(params).promise();
      if (!result.Body) {
        throw new FileNotFoundError();
      }
      fileWithData.data = result.Body as Buffer;
      return fileWithData;
    } catch (error) {
      throw new FileNotFoundError();
    }
  }

  async init(): Promise<void> {
    try {
      await this.s3
        .headBucket({ Bucket: this.config.defaultBucketName })
        .promise();
    } catch (error) {
      throw new Error('bucket does not exist');
    }
  }
}
