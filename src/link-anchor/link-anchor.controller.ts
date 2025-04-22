import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { PaginationDto } from "src/shared/dto";
import { LinkAnchorDto, MintManyRequestDto, SetLinkAnchorDto } from "./dtos";
import { LinkAnchorService } from "./link-anchor.service";

@Controller("link-anchors")
export class LinkAnchorController {
  constructor(private readonly linkAnchorService: LinkAnchorService) {}

  @Post("mint")
  @ApiOperation({
    operationId: "mintLinkAnchor",
    summary: "Mint a new link anchor",
    description: "Mint a new link anchor",
  })
  public async mint(): Promise<LinkAnchorDto> {
    return this.linkAnchorService.mint();
  }

  @Post("mint-many")
  @ApiOperation({
    operationId: "mintManyLinkAnchors",
    summary: "Mint many link anchors",
    description: "Mint many link anchors",
  })
  public async mintMany(
    @Body() body: MintManyRequestDto,
  ): Promise<LinkAnchorDto[]> {
    return this.linkAnchorService.mintMany(body.quantity);
  }

  @Post(":id/set")
  @ApiOperation({
    operationId: "setLinkAnchorLinkSet",
    summary: "Set the link set for a link anchor",
    description: "Set the link set for a link anchor",
  })
  @HttpCode(200)
  public async set(@Param("id") id: string, @Body() body: SetLinkAnchorDto) {
    return this.linkAnchorService.set(id, body.linkSetId);
  }

  @Get(":id")
  public async get(@Param("id") id: string): Promise<LinkAnchorDto> {
    return this.linkAnchorService.get(id);
  }

  @Get()
  @ApiOperation({
    operationId: "getManyLinkAnchors",
    summary: "Get many link anchors",
    description: "Get many link anchors",
  })
  public async getMany(
    @Query() paginationDto: PaginationDto,
  ): Promise<LinkAnchorDto[]> {
    return this.linkAnchorService.getMany(paginationDto);
  }
}
