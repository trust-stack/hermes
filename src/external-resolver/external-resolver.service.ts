import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PaginationDto } from "src/shared/dto";
import { v4 as uuid } from "uuid";
import { PrismaService } from "../prisma/prisma.service";
import {
  ExternalResolverSetDto,
  UpsertExternalResolverSetDto,
} from "./external-resolver.dto";

@Injectable()
export class ExternalResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: string): Promise<ExternalResolverSetDto> {
    return this.prisma.externalResolverSet
      .findFirst({
        where: {
          id,
        },
        include: {
          resolvers: true,
        },
      })
      .then(toDto);
  }

  async getMany(pagination: PaginationDto): Promise<ExternalResolverSetDto[]> {
    return this.prisma.externalResolverSet
      .findMany({
        include: {
          resolvers: true,
        },
        orderBy: {
          pattern: "asc",
        },
        skip: pagination?.offset ? +pagination?.offset : undefined,
        take: pagination.limit ? +pagination.limit : undefined,
      })
      .then((models) => models?.map(toDto));
  }

  async upsertExternalResolverSet(dto: UpsertExternalResolverSetDto) {
    return this.prisma
      .$transaction(async (tx) => {
        const id = dto.id || uuid();

        if (dto.id) {
          await tx.externalResolver.deleteMany({
            where: {
              id: dto.id,
            },
          });
        }

        return tx.externalResolverSet.upsert({
          where: {
            id,
          },
          create: {
            id,
            pattern: dto.pattern,
            resolvers: {
              createMany: {
                data: dto?.resolvers?.map((resolver) => ({
                  pattern: resolver.pattern,
                  href: resolver.href,
                })),
              },
            },
          },
          update: {
            id,
            pattern: dto.pattern,
            resolvers: {
              createMany: {
                data: dto?.resolvers?.map((resolver) => ({
                  pattern: resolver.pattern,
                  href: resolver.href,
                })),
              },
            },
          },
          include: {
            resolvers: true,
          },
        });
      })
      .then(toDto);
  }

  async delete(id: string): Promise<string> {
    await this.prisma.linkset.delete({ where: { id } });

    return id;
  }
}

const prismaDto = Prisma.validator<Prisma.ExternalResolverSetDefaultArgs>()({
  include: {
    resolvers: true,
  },
});

type PrismaDTO = Prisma.ExternalResolverSetGetPayload<typeof prismaDto>;

const toDto = (prismaDto: PrismaDTO): ExternalResolverSetDto => {
  if (!prismaDto) return;

  return {
    id: prismaDto.id,
    pattern: prismaDto.pattern,
    updatedAt: prismaDto.updatedAt,
    createdAt: prismaDto.createdAt,
    resolvers: prismaDto.resolvers?.map((r) => ({
      href: r.href,
      pattern: r.pattern,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })),
  };
};
