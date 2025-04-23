import {Inject, Injectable, Scope} from "@nestjs/common";
import {Prisma, PrismaClient} from "@prisma/client";
import {v4 as uuid} from "uuid";
import {PaginationDto} from "../shared/dto";
import {CreateLinkSetDto, LinkSetDto, UpdateLinkSetDto} from "./dtos";
import {HrefBuilderService} from "./href-builder.service";

@Injectable({scope: Scope.REQUEST})
export class LinkSetService {
  constructor(
    @Inject("PRISMA_CLIENT") private readonly prisma: PrismaClient,
    private readonly hrefBuilder: HrefBuilderService
  ) {}

  async get(id: string): Promise<LinkSetDto> {
    return this.prisma.linkSet
      .findUnique({
        where: {id},
        include: {links: true},
      })
      .then(this.toDto.bind(this));
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
      .then((models) => Promise.all([...models.map((dto) => this.toDto(dto))]));
  }

  async delete(id: string): Promise<string> {
    await this.prisma.linkSet.delete({where: {id}});
    return id;
  }

  async update(id: string, dto: UpdateLinkSetDto) {
    // Delete existing links
    await this.prisma.linkSet.deleteMany({where: {id}});

    // Recreate
    return await this.create(dto);
  }

  async create(dto: CreateLinkSetDto) {
    const id = uuid();

    return this.prisma.linkSet
      .create({
        data: {
          id,
          qualifier: dto.qualifier,
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
      .then(this.toDto.bind(this));
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
      linkSetDto.links.push({
        relationType: link.relationType,
        // Call injectable service to build href.
        href: await this.hrefBuilder.buildHref(link.id),
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
