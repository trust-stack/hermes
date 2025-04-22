import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { LinkAnchor, PrismaClient } from "@prisma/client";
import { uuid } from "../shared";
import { PaginationDto } from "../shared/dto";
import { LinkAnchorDto } from "./dtos";

@Injectable()
export class LinkAnchorService {
  constructor(@Inject("PRISMA_CLIENT") private readonly prisma: PrismaClient) {}

  /**
   * Mint a new link anchor
   * @returns The link anchor
   */
  public async mint(): Promise<LinkAnchorDto> {
    const linkAnchor = await this.prisma.linkAnchor.create({
      data: {},
    });

    return this.toLinkAnchorDto(linkAnchor);
  }

  /**
   * Mint many link anchors
   * @param quantity The number of link anchors to mint
   * @returns The link anchors
   */
  public async mintMany(quantity: number): Promise<LinkAnchorDto[]> {
    const ids = new Array(quantity).fill(0).map(() => uuid());

    await this.prisma.linkAnchor.createMany({
      data: ids.map((id) => ({ id })),
    });

    const linkAnchors = await this.prisma.linkAnchor.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return linkAnchors.map(this.toLinkAnchorDto.bind(this));
  }

  /**
   * Set the link set for a link anchor
   * @param id The id of the link anchor
   * @param linkSetId The id of the link set
   * @returns The link anchor
   */
  public async set(id: string, linkSetId: string) {
    // First verify that the LinkAnchor exists
    const existingAnchor = await this.prisma.linkAnchor.findUnique({
      where: { id },
    });

    if (!existingAnchor) {
      throw new NotFoundException(`LinkAnchor with id ${id} not found`);
    }

    // Then verify that the LinkSet exists
    const linkSet = await this.prisma.linkSet.findUnique({
      where: { id: linkSetId },
    });

    if (!linkSet) {
      throw new NotFoundException(`LinkSet with id ${linkSetId} not found`);
    }

    // Update the LinkAnchor
    const linkAnchor = await this.prisma.linkAnchor.update({
      where: { id },
      data: {
        linkSet: {
          connect: {
            id: linkSetId,
          },
        },
        updatedAt: new Date(),
      },
    });

    return this.toLinkAnchorDto(linkAnchor);
  }

  /**
   * Get a link anchor
   * @param id The id of the link anchor
   * @returns The link anchor
   */
  public async get(id: string): Promise<LinkAnchorDto> {
    const linkAnchor = await this.prisma.linkAnchor.findUnique({
      where: { id },
    });

    if (!linkAnchor) {
      throw new NotFoundException(`LinkAnchor with id ${id} not found`);
    }

    return this.toLinkAnchorDto(linkAnchor);
  }

  /**
   * Get many link anchors
   * @param offset The offset
   * @param limit The limit
   * @returns The link anchors
   */
  public async getMany(pagination: PaginationDto): Promise<LinkAnchorDto[]> {
    const linkAnchors = await this.prisma.linkAnchor.findMany({
      skip: pagination?.offset ? +pagination?.offset : undefined,
      take: pagination.limit ? +pagination.limit : undefined,
    });

    return linkAnchors.map(this.toLinkAnchorDto.bind(this));
  }

  private toLinkAnchorDto(linkAnchor: LinkAnchor): LinkAnchorDto {
    if (!linkAnchor) {
      return null;
    }

    return {
      id: linkAnchor.id,
      createdAt: linkAnchor.createdAt,
      updatedAt: linkAnchor.updatedAt,
      linkSetId: linkAnchor.linkSetId,
    };
  }
}
