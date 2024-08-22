import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import { config } from "src/shared/config";

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: config.S3_REGION,
      credentials: {
        accessKeyId: config.S3_ACCESS_KEY_ID,
        secretAccessKey: config.S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
      endpoint: config.S3_ENDPOINT,
    });
  }

  public async generatePutPresignedUrl(
    objectKey: string,
    expiresIn = 3600,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: config.S3_BUCKET,
      Key: objectKey,
    });

    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn,
    });

    return presignedUrl;
  }

  public async generateGetPresignedUrl(
    objectKey: string,
    expiresIn = 3600,
  ): Promise<string> {
    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: config.S3_BUCKET,
      Key: objectKey,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn,
    });
  }
}
