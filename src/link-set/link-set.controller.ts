import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PaginationDto } from "../shared/dto";
import { CreateLinkSetDto, LinkSet, UpdateLinkSetDto } from "./link-set.dto";
import { LinkSetService } from "./link-set.service";

@Controller("link-sets")
export class LinkSetController {
  constructor(
    @Inject()
    private readonly linkSetService: LinkSetService,
  ) {}

  @ApiOperation({
    operationId: "createLinkSet",
    summary: "Create a new Link Set",
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
    summary: "Update an existing Link Set",
  })
  @ApiResponse({
    status: 201,
    description: "The Link Set was updated.",
    type: LinkSet,
  })
  @Put()
  async update(@Body() dto: UpdateLinkSetDto) {
    return this.linkSetService.update(dto);
  }

  @ApiOperation({ operationId: "getLinkSet", summary: "Get a Link Set by ID" })
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
    summary: "Get all paginated Link Sets",
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
    summary: "Delete a Link Set by ID",
  })
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.linkSetService.delete(id);
  }
}
