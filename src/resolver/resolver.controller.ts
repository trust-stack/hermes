import { Controller, Get, NotFoundException, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { ResolverService } from "./resolver.service";

@Controller()
export class ResolverController {
  constructor(private readonly resolverService: ResolverService) {}

  @Get("*")
  async resolve(@Req() request: Request, @Res() res: Response) {
    try {
      const result = await this.resolverService.resolve(request.path);

      if ("redirectUrl" in result && !!result.redirectUrl)
        return res.redirect(302, result.redirectUrl);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundException)
        return { statusCode: 404, message: error.message };

      throw error;
    }
  }

  @Get("/.well-known/resolver")
  getResolverMetadata() {
    return this.resolverService.getResolverMetadata();
  }
}
