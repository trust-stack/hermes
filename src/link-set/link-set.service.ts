import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { PrismaService } from "../prisma/prisma.service";
import { PaginationDto } from "../shared/dto";
import { LinkSetDto, UpsertLinkSetDto } from "./link-set.dto";

@Injectable()
export class LinkSetService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: string): Promise<LinkSetDto> {
    return this.prisma.linkset
      .findUnique({
        where: { id },
        include: { links: true },
      })
      .then(toDto);
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
        skip: +((pagination.page - 1) * pagination.limit || 0),
        take: pagination.limit ? +pagination.limit : undefined,
      })
      .then((models) => models?.map(toDto));
  }

  async delete(id: string): Promise<string> {
    await this.prisma.linkset.delete({ where: { id } });
    return id;
  }

  async upsert(dto: UpsertLinkSetDto) {
    return this.prisma.$transaction(async (tx) => {
      const id = dto.id || uuid();

      if (dto.id) {
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
            identifier: dto.identifier,
            links: {
              createMany: {
                data: dto.links.map((link) => ({
                  relationType: link.relationType,
                  href: link.href,
                  title: link.title,
                  lang: link.lang,
                })),
              },
            },
          },
          update: {
            id,
            identifier: dto.identifier,
            links: {
              createMany: {
                data: dto.links.map((link) => ({
                  relationType: link.relationType,
                  href: link.href,
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
        .then(toDto);
    });
  }
}

const prismaDto = Prisma.validator<Prisma.LinksetDefaultArgs>()({
  include: {
    links: true,
  },
});

type PrismaDTO = Prisma.LinksetGetPayload<typeof prismaDto>;

const toDto = (prismaDto: PrismaDTO): LinkSetDto => {
  if (!prismaDto) return;

  return {
    id: prismaDto.id,
    identifier: prismaDto.identifier,
    updatedAt: prismaDto.updatedAt,
    createdAt: prismaDto.createdAt,
    links: prismaDto.links?.map((l) => ({
      relationType: l.relationType,
      href: l.href,
      title: l.title,
      lang: l.lang,
      updatedAt: l.updatedAt,
      createdAt: l.createdAt,
    })),
  };
};
