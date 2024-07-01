import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ExternalResolverSetDto } from "./external-resolver.dto";
import { ExternalResolverService } from "./external-resolver.service";

@Controller("external-resolvers")
export class ExternalResolveController {
  constructor(
    private readonly externalResolverService: ExternalResolverService
  ) { }

  @Post()
  async create(@Body() dto: ExternalResolverSetDto) {
    return this.externalResolverService.upsertExternalResolverSet(dto);
  }

  @Put()
  async update(@Body() dto: ExternalResolverSetDto) {
    return this.externalResolverService.upsertExternalResolverSet(dto);
  }

  @Get('/:id')
  async get(@Param("id") id: string) {
    return this.externalResolverService.get(id)
  }
}
