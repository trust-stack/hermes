import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { S3Service } from "src/s3/s3.service";
import { CreateObjectDto, CreateObjectResponseDto } from "./object.dto";

@Injectable()
export class ObjectService {
  constructor(
    private readonly s3: S3Service,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Create a Object in persistance, and generate a presigned PUT url
   * for client to push object to S3.
   * @param dto Create Object schema
   * @returns
   */
  public async createObject(
    dto: CreateObjectDto,
  ): Promise<CreateObjectResponseDto> {
    // Create object in database
    const object = await this.prisma.object.create({
      data: {
        name: dto.name,
        mimeType: dto.mimeType,
        size: dto.size,
      },
    });

    // Generate presigned URL
    const presignedUrl = await this.s3.generatePutPresignedUrl(object.id);

    return {
      key: object.id,
      presignedUrl,
    };
  }

  /**
   *
   * @param objectKey ID of object being requested
   * @returns Presigned GET url to retrieve object from S3
   */
  public async generateGetPresignedUrl(objectKey: string) {
    return this.s3.generateGetPresignedUrl(objectKey);
  }
}
