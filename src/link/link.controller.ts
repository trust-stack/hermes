import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateLinkDto, LinkConfigurationDto} from "./dtos";
import {LinkService} from "./link.service";

@Controller("links")
@ApiTags("Link")
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post()
  @ApiOperation({
    operationId: "createLink",
    summary: "Create Link",
  })
  @ApiResponse({
    status: 201,
    description: "The Link was created successfully.",
    type: LinkConfigurationDto,
  })
  async create(
    @Body() createLinkDto: CreateLinkDto
  ): Promise<LinkConfigurationDto> {
    return this.linkService.create(createLinkDto);
  }

  @Get(":id")
  @ApiOperation({
    operationId: "getLink",
    summary: "Get Link by ID",
  })
  @ApiResponse({
    status: 200,
    description: "The Link was found and returned.",
    type: LinkConfigurationDto,
  })
  async get(@Param("id") id: string): Promise<LinkConfigurationDto> {
    return this.linkService.get(id);
  }

  @Get()
  @ApiOperation({
    operationId: "getLinks",
    summary: "Get Links",
  })
  @ApiResponse({
    status: 200,
    description: "The Links were found and returned.",
    type: [LinkConfigurationDto],
  })
  async getMany(
    @Query("offset") offset?: number,
    @Query("limit") limit?: number
  ): Promise<LinkConfigurationDto[]> {
    return this.linkService.getMany({
      offset: offset ? Number(offset) : 0,
      limit: limit ? Number(limit) : 100,
    });
  }

  @Delete(":id")
  @ApiOperation({
    operationId: "deleteLink",
    summary: "Delete Link",
  })
  @ApiResponse({
    status: 200,
    description: "The Link was deleted successfully.",
  })
  async delete(@Param("id") id: string): Promise<void> {
    return this.linkService.delete(id);
  }
}
