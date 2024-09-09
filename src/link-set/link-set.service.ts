import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { ObjectService } from "src/object/object.service";
import { v4 as uuid } from "uuid";
import { PrismaService } from "../prisma/prisma.service";
import { PaginationDto } from "../shared/dto";
import { LinkSetDto, UpsertLinkSetDto } from "./link-set.dto";

@Injectable()
export class LinkSetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly object: ObjectService,
  ) {}

  async get(id: string): Promise<LinkSetDto> {
    return this.prisma.linkset
      .findUnique({
        where: { id },
        include: { links: true },
      })
      .then(this.toDto);
  }

  async getMany(pagination: PaginationDto): Promise<LinkSetDto[]> {
    return this.prisma.linkset
      .findMany({
        include: {
          links: true,
        },
        orderBy: {
          identifier: "asc",
        },
        skip: pagination?.offset ? +pagination?.offset : undefined,
        take: pagination.limit ? +pagination.limit : undefined,
      })
      .then((models) => Promise.all([...models.map(this.toDto)]));
  }

  async delete(id: string): Promise<string> {
    await this.prisma.linkset.delete({ where: { id } });
    return id;
  }

  async upsert(dto: UpsertLinkSetDto) {
    return this.prisma.$transaction(async (tx) => {
      const id = dto.id || uuid();

      if (dto.id) {
        // Delete existing links for total upsert
        await tx.link.deleteMany({
          where: {
            linksetId: dto.id,
          },
        });
      }

      return tx.linkset
        .upsert({
          where: {
            id,
          },
          create: {
            id,
            qualifier: dto.qualifier,
            identifier: dto.identifier,
            links: {
              createMany: {
                data: dto.links.map((link) => ({
                  relationType: link.relationType,
                  type: link.type,
                  href: link.href,
                  objectId: link.objectKey,
                  title: link.title,
                  lang: link.lang,
                })),
              },
            },
          },
          update: {
            id,
            qualifier: dto.qualifier,
            identifier: dto.identifier,
            links: {
              createMany: {
                data: dto.links.map((link) => ({
                  relationType: link.relationType,
                  type: link.type,
                  href: link.href,
                  objectId: link.objectKey,
                  title: link.title,
                  lang: link.lang,
                })),
              },
            },
          },
          include: {
            links: true,
          },
        })
        .then(this.toDto);
    });
  }

  private async toDto(prismaDto: PrismaDTO): Promise<LinkSetDto> {
    if (!prismaDto) return;

    const linkSetDto = {
      id: prismaDto.id,
      identifier: prismaDto.identifier,
      qualifier: prismaDto.qualifier,
      updatedAt: prismaDto.updatedAt,
      createdAt: prismaDto.createdAt,
      links: [],
    };

    for (const link of prismaDto.links) {
      // If this is a OBJECT, generate presigned URL
      const href =
        link.type == "HREF"
          ? link.href
          : await this.object.generateGetPresignedUrl(link.objectId);

      linkSetDto.links.push({
        relationType: link.relationType,
        type: link.type,
        href,
        title: link.title,
        lang: link.lang,
        updatedAt: link.updatedAt,
        createdAt: link.createdAt,
      });
    }

    return linkSetDto;
  }
}

const prismaDto = Prisma.validator<Prisma.LinksetDefaultArgs>()({
  include: {
    links: true,
  },
});

type PrismaDTO = Prisma.LinksetGetPayload<typeof prismaDto>;
