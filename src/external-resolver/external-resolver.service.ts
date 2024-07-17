import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PaginationDto } from "src/shared/dto";
import { v4 as uuid } from "uuid";
import { PrismaService } from "../prisma/prisma.service";
import {
  ExternalResolverDto,
  UpsertExternalResolverDto,
} from "./external-resolver.dto";

@Injectable()
export class ExternalResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: string): Promise<ExternalResolverDto> {
    return this.prisma.externalResolver
      .findFirst({
        where: {
          id,
        },
        include: {
          childExternalResolvers: true,
        },
      })
      .then(toDto);
  }

  async getMany(pagination: PaginationDto): Promise<ExternalResolverDto[]> {
    return this.prisma.externalResolver
      .findMany({
        include: Include,
        orderBy: {
          pattern: "asc",
        },
        skip: pagination?.offset ? +pagination?.offset : undefined,
        take: pagination.limit ? +pagination.limit : undefined,
      })
      .then((models) => models?.map(toDto));
  }

  async upsertExternalResolverSet(dto: UpsertExternalResolverDto) {
    return this.prisma.$transaction(async (tx) => {
      const id = dto.id || uuid();

      // Delete resolver, cascade delete children
      if (dto.id) {
        await tx.externalResolver.delete({
          where: {
            id: dto.id,
          },
        });
      }

      // Create primary resolver
      await tx.externalResolver.create({
        data: {
          id,
          qualifier: dto.qualifier,
          pattern: dto.pattern,
          href: dto.href,
        },
      });

      async function createChildResolver(dto: UpsertExternalResolverDto) {
        await tx.externalResolver.create({
          data: {
            parentExternalResolverId: id,
            qualifier: dto.qualifier,
            pattern: dto.pattern,
            href: dto.href,
          },
        });

        if (!dto?.childExternalResolvers) return;

        for (const child of dto.childExternalResolvers) {
          await createChildResolver(child);
        }
      }

      // Create child resolvers
      for (const child of dto.childExternalResolvers || []) {
        createChildResolver(child);
      }

      return tx.externalResolver
        .findUnique({
          where: {
            id,
          },
          include: Include,
        })
        .then(toDto);
    });
  }

  async delete(id: string): Promise<string> {
    await this.prisma.externalResolver.delete({ where: { id } });
    return id;
  }
}

// Supporting child depth of 5 arbitrarily for now, can be increased
const Include = {
  childExternalResolvers: {
    include: {
      childExternalResolvers: {
        include: {
          childExternalResolvers: {
            include: {
              childExternalResolvers: true,
            },
          },
        },
      },
    },
  },
};

const prismaDto = Prisma.validator<Prisma.ExternalResolverDefaultArgs>()({
  include: Include,
});

type PrismaDTO = Prisma.ExternalResolverGetPayload<typeof prismaDto>;

const toDto = (prismaDto: PrismaDTO): ExternalResolverDto => {
  if (!prismaDto) return;

  return {
    id: prismaDto.id,
    pattern: prismaDto.pattern,
    updatedAt: prismaDto.updatedAt,
    createdAt: prismaDto.createdAt,
    qualifier: prismaDto.qualifier,
    href: prismaDto.href,
    childExternalResolvers: prismaDto.childExternalResolvers?.map(toDto),
  };
};
