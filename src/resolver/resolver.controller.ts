import { Controller, Get, Query, Redirect } from "@nestjs/common";
import { ResolverService } from "./resolver.service";

@Controller()
export class ResolverController {
  constructor(private readonly resolverService: ResolverService) {}

  @Get("/resolve")
  @Redirect()
  async resolve(
    @Query("identifier") identifier: string,
    @Query("linkType") linkType?: string
  ) {
    // try {
    //   const result = await this.resolverService.resolve(identifier, linkType);
    //   if (result.redirectUrl) {
    //     return { url: result.redirectUrl, statusCode: 302 };
    //   } else {
    //     return result;
    //   }
    // } catch (error) {
    //   if (error instanceof NotFoundException) {
    //     return { statusCode: 404, message: error.message };
    //   }
    //   throw error;
    // }
  }

  @Get("/.well-known/resolver")
  getResolverMetadata() {
    return this.resolverService.getResolverMetadata();
  }
}
