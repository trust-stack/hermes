import { Injectable } from "@nestjs/common";
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
    return this.prisma.externalResolverSet.findFirst({
      where: {
        id,
      },
      include: {
        resolvers: true,
      },
    });
  }

  async upsertExternalResolverSet(dto: UpsertExternalResolverSetDto) {
    return this.prisma.$transaction(async (tx) => {
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
    });
  }

  async delete(id: string): Promise<string> {
    await this.prisma.linkset.delete({ where: { id } });

    return id;
  }
}
