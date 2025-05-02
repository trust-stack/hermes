import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {Link, PrismaClient} from "@prisma/client";
import {CreateLinkDto, LinkConfigurationDto} from "./dtos";
import {validatePath, validateType} from "./utils";

@Injectable()
export class LinkService {
  constructor(@Inject("PRISMA_CLIENT") private prisma: PrismaClient) {}

  /**
   * Create a new Link.
   * @param dto The CreateLinkDto object.
   * @returns The created Link.
   */
  public async create(dto: CreateLinkDto) {
    validatePath(dto.path);
    validateType(dto.type);

    const link = await this.prisma.$transaction(async (tx) => {
      if (dto.default) {
        const links = await tx.link.findMany({
          where: {
            path: dto.path,
          },
        });

        const defaultLink = links.find((link) => link.default === true);

        if (defaultLink) {
          throw new BadRequestException(
            "Default link already exists for this path."
          );
        }
      }

      return await tx.link.create({
        data: {
          path: dto.path,
          relationType: dto.relationType,
          href: dto.href,
          title: dto.title,
          type: dto.type,
          hreflang: dto.hreflang,
          default: dto.default,
        },
      });
    });

    return this.toLinkDto(link);
  }

  /**
   * Get a Link by ID.
   * @param id The ID of the Link.
   * @returns The Link.
   */
  public async get(id: string) {
    const link = await this.prisma.link.findUnique({
      where: {
        id,
      },
    });

    if (!link) {
      throw new NotFoundException("Link not found");
    }

    return this.toLinkDto(link);
  }

  /**
   * Get many Links.
   * @param offset The offset of the Links.
   * @param limit The limit of the Links.
   * @returns The Links.
   */
  public async getMany({offset = 0, limit = 100}: GetManyProps) {
    const links = await this.prisma.link.findMany({
      skip: offset,
      take: limit,
    });

    return links.map(this.toLinkDto);
  }

  /**
   * Delete a Link by ID.
   * @param id The ID of the Link.
   */
  public async delete(id: string) {
    await this.prisma.link.delete({
      where: {
        id,
      },
    });
  }

  private toLinkDto(link: Link): LinkConfigurationDto {
    if (!link) return;
    return {
      id: link.id,
      path: link.path,
      type: link.type,
      title: link.title,
      href: link.href,
      hrefLang: link.hreflang,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    };
  }
}

type GetManyProps = {
  offset: number;
  limit: number;
};
