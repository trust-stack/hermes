import {Inject, Injectable, Scope} from "@nestjs/common";
import {Prisma, PrismaClient} from "@prisma/client";
import {v4 as uuid} from "uuid";
import {PaginationDto} from "../shared/dto";
import {
  CreateExternalResolverDto,
  ExternalResolverDto,
  UpdateExternalResolverDto,
} from "./dtos";

@Injectable({scope: Scope.REQUEST})
export class ExternalResolverService {
  constructor(@Inject("PRISMA_CLIENT") private readonly prisma: PrismaClient) {}

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

  async update(id: string, dto: UpdateExternalResolverDto) {
    // Delete resolver, cascade delete children
    await this.prisma.externalResolver.delete({
      where: {id: id},
    });

    // Recreate
    return await this.create(dto);
  }

  async create(dto: CreateExternalResolverDto) {
    const id = uuid();

    // Create primary resolver
    return await this.prisma.externalResolver.create({
      data: {
        qualifier: dto.qualifier,
        pattern: dto.pattern,
        href: dto.href,
      },
    });

    async function createChildResolver(dto: CreateExternalResolverDto) {
      await this.prisma.externalResolver.create({
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

    return this.prisma.externalResolver
      .findUnique({
        where: {
          id,
        },
        include: Include,
      })
      .then(toDto);
  }

  async delete(id: string): Promise<string> {
    await this.prisma.externalResolver.delete({where: {id}});
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
