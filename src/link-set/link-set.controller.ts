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
import { PaginationDto } from "../shared/dto";
import { UpsertLinkSetDto } from "./link-set.dto";
import { LinkSetService } from "./link-set.service";

@Controller("link-sets")
export class LinkSetController {
  constructor(private readonly linkSetService: LinkSetService) {}

  @Post()
  async create(@Body() dto: Omit<UpsertLinkSetDto, "id">) {
    return this.linkSetService.upsert(dto);
  }

  @Put()
  async update(@Body() dto: UpsertLinkSetDto) {
    return this.linkSetService.upsert(dto);
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const linkSet = await this.linkSetService.get(id);

    if (!linkSet) throw new NotFoundException("Link Set not found.");

    return linkSet;
  }

  @Get()
  async getMany(@Query() paginationDto: PaginationDto) {
    return this.linkSetService.getMany(paginationDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.linkSetService.delete(id);
  }
}
