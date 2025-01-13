import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { PaginationDto } from "../shared/dto";
import {
  CreateExternalResolverDto,
  UpdateExternalResolverDto,
} from "./external-resolver.dto";
import { ExternalResolverService } from "./external-resolver.service";

@Controller("/external-resolvers")
export class ExternalResolverController {
  constructor(
    @Inject()
    private readonly externalResolverService: ExternalResolverService,
  ) {}

  @ApiOperation({
    operationId: "createExternalResolver",
  })
  @Post("")
  async create(@Body() dto: CreateExternalResolverDto) {
    return this.externalResolverService.create(dto);
  }

  @ApiOperation({
    operationId: "updateExternalResolver",
  })
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateExternalResolverDto,
  ) {
    return this.externalResolverService.update(id, dto);
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
