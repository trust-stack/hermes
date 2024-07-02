import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Redirect,
} from "@nestjs/common";
import { ResolverService } from "./resolver.service";

@Controller()
export class ResolverController {
  constructor(private readonly resolverService: ResolverService) {}

  @Get("/:identifier")
  @Redirect()
  async resolve(@Param("identifier") identifier: string) {
    try {
      const result = await this.resolverService.resolve(identifier);

      if (result.redirectUrl) {
        return { url: result.redirectUrl, statusCode: 302 };
      } else {
        return result;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { statusCode: 404, message: error.message };
      }
      throw error;
    }
  }

  @Get("/.well-known/resolver")
  getResolverMetadata() {
    return this.resolverService.getResolverMetadata();
  }
}
