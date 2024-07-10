import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { PaginationDto } from "src/shared/dto";
import { UpsertExternalResolverSetDto } from "./external-resolver.dto";
import { ExternalResolverService } from "./external-resolver.service";

@Controller("external-resolvers")
export class ExternalResolveController {
  constructor(
    private readonly externalResolverService: ExternalResolverService,
  ) {}

  @Post()
  async create(@Body() dto: UpsertExternalResolverSetDto) {
    return this.externalResolverService.upsertExternalResolverSet(dto);
  }

  @Put()
  async update(@Body() dto: UpsertExternalResolverSetDto) {
    return this.externalResolverService.upsertExternalResolverSet(dto);
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return this.externalResolverService.get(id);
  }

  @Get()
  async getMany(@Query() paginationDto: PaginationDto) {
    return this.externalResolverService.getMany(paginationDto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.externalResolverService.delete(id);
  }
}
