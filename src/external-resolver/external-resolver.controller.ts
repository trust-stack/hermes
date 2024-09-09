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
import { ApiOperation } from "@nestjs/swagger";
import { PaginationDto } from "src/shared/dto";
import { UpsertExternalResolverDto } from "./external-resolver.dto";
import { ExternalResolverService } from "./external-resolver.service";

@Controller("external-resolvers")
export class ExternalResolveController {
  constructor(
    private readonly externalResolverService: ExternalResolverService,
  ) {}

  @ApiOperation({
    operationId: "createExternalResolver",
  })
  @Post()
  async create(@Body() dto: UpsertExternalResolverDto) {
    return this.externalResolverService.upsertExternalResolverSet(dto);
  }

  @ApiOperation({
    operationId: "updateExternalResolver",
  })
  @Put()
  async update(@Body() dto: UpsertExternalResolverDto) {
    return this.externalResolverService.upsertExternalResolverSet(dto);
  }

  @ApiOperation({
    operationId: "getExternalResolver",
  })
  @Get(":id")
  async get(@Param("id") id: string) {
    return this.externalResolverService.get(id);
  }

  @ApiOperation({
    operationId: "getManyExternalResolvers",
  })
  @Get()
  async getMany(@Query() paginationDto: PaginationDto) {
    return this.externalResolverService.getMany(paginationDto);
  }

  @ApiOperation({
    operationId: "deleteExternalResolver",
  })
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.externalResolverService.delete(id);
  }
}
