import { Injectable } from "@nestjs/common";
import { Object } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { S3Service } from "../s3/s3.service";
import { PaginationDto } from "../shared/dto";
import {
  CreateObjectDto,
  CreateObjectResponseDto,
  ObjectDto,
} from "./object.dto";

@Injectable()
export class ObjectService {
  constructor(
    private readonly s3: S3Service,
    private readonly prisma: PrismaService,
  ) {}

  public async get(id: string): Promise<ObjectDto> {
    return this.prisma.object
      .findUnique({
        where: {
          id,
        },
      })
      .then(this.toDto);
  }

  // TODO: should clear from bucket in future
  public async delete(id: string): Promise<string> {
    await this.prisma.object.delete({ where: { id } });
    return id;
  }

  public async getMany(pagination: PaginationDto): Promise<ObjectDto[]> {
    return this.prisma.object
      .findMany({
        orderBy: {
          name: "asc",
        },
        skip: pagination?.offset ? +pagination?.offset : undefined,
        take: pagination.limit ? +pagination.limit : undefined,
      })
      .then((dtos) => Promise.all([...dtos.map(this.toDto)]));
  }

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

  private async toDto(prismaDto: Object): Promise<ObjectDto> {
    const url = await this.generateGetPresignedUrl(prismaDto.id);

    return {
      id: prismaDto.id,
      name: prismaDto.name,
      mimeType: prismaDto.mimeType,
      size: prismaDto.size,
      url,
    };
  }
}
