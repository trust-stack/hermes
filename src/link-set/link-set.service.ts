import { Inject, Injectable } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { PaginationDto } from "../shared/dto";
import { CreateLinkSetDto, LinkSetDto, UpdateLinkSetDto } from "./link-set.dto";

@Injectable()
export class LinkSetService {
  constructor(@Inject("PRISMA_CLIENT") private readonly prisma: PrismaClient) {}

  async get(id: string): Promise<LinkSetDto> {
    return this.prisma.linkSet
      .findUnique({
        where: { id },
        include: { links: true },
      })
      .then(this.toDto);
  }

  async getMany(pagination: PaginationDto): Promise<LinkSetDto[]> {
    return this.prisma.linkSet
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
    await this.prisma.linkSet.delete({ where: { id } });
    return id;
  }

  async update(dto: UpdateLinkSetDto) {
    // Delete existing links
    await this.prisma.linkSet.deleteMany({ where: { id: dto.id } });

    // Recreate
    return await this.create(dto);
  }

  async create(dto: CreateLinkSetDto) {
    const id = uuid();

    return this.prisma.linkSet
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
      const href = link.href;

      linkSetDto.links.push({
        relationType: link.relationType,
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

const prismaDto = Prisma.validator<Prisma.LinkSetDefaultArgs>()({
  include: {
    links: true,
  },
});

type PrismaDTO = Prisma.LinkSetGetPayload<typeof prismaDto>;
