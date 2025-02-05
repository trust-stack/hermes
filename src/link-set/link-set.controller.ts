import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "../shared/dto";
import { CreateLinkSetDto, LinkSet, UpdateLinkSetDto } from "./link-set.dto";
import { LinkSetService } from "./link-set.service";

@Controller("link-sets")
@ApiTags("Link Set")
export class LinkSetController {
  constructor(private readonly linkSetService: LinkSetService) {}

  @ApiOperation({
    operationId: "createLinkSet",
    summary: "Create Link Set",
  })
  @ApiResponse({
    status: 201,
    description: "The Link Set was created.",
    type: LinkSet,
  })
  @Post()
  async create(@Body() dto: CreateLinkSetDto) {
    return this.linkSetService.create(dto);
  }

  @ApiOperation({
    operationId: "updateLinkSet",
    summary: "Update Link Set",
  })
  @ApiResponse({
    status: 201,
    description: "The Link Set was updated.",
    type: LinkSet,
  })
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateLinkSetDto) {
    return this.linkSetService.update(id, dto);
  }

  @ApiOperation({ operationId: "getLinkSet", summary: "Get Link Set" })
  @ApiResponse({
    status: 200,
    description: "The Link Set was found and returned.",
    type: LinkSet,
  })
  @Get(":id")
  async get(@Param("id") id: string) {
    const linkSet = await this.linkSetService.get(id);

    if (!linkSet) throw new NotFoundException("Link Set not found.");

    return linkSet;
  }

  @ApiOperation({
    operationId: "getLinkSets",
    summary: "Get Link Sets",
  })
  @ApiResponse({
    status: 200,
    description: "The Link Sets were found and returned.",
    type: [LinkSet],
  })
  @Get()
  async getMany(@Query() paginationDto: PaginationDto) {
    return this.linkSetService.getMany(paginationDto);
  }

  @ApiOperation({
    operationId: "deleteLinkSet",
    summary: "Delete Link Set",
  })
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.linkSetService.delete(id);
  }
}
