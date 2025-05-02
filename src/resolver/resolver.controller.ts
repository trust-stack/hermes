import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Query,
  Res,
} from "@nestjs/common";
import {PrismaClient} from "@prisma/client";
import {Response} from "express";
import {validatePath} from "../link/utils";
import {AnchorService} from "./anchor.service";

@Controller()
export class ResolverController {
  constructor(
    @Inject("PRISMA_CLIENT") private readonly prisma: PrismaClient,
    private readonly anchorService: AnchorService
  ) {}

  @Get(":path(*)")
  async resolve(
    @Res() res: Response,
    @Param("path") path: string,
    @Query("linkType") linkType?: string
  ) {
    path = `/${path}`;

    // Check if the path is a valid path
    try {
      validatePath(path);
    } catch (error) {
      return new BadRequestException("Invalid path.");
    }

    // Find all links for the path
    const links = await this.prisma.link.findMany({
      where: {
        path: path,
      },
    });

    if (!links.length) throw new NotFoundException("No links found.");

    // Client is implicitly requesting a default link
    if (!linkType) {
      const defaultLink = links.find((link) => link.default);

      // If a default link is found, redirect to it
      if (defaultLink) return res.redirect(307, defaultLink.href);
      // If there is default link, throw a 404
      else throw new NotFoundException("No default link found.");
    }

    // If linkType is linkset, return all
    if (linkType == "linkset") {
      return res.json({
        linkset: [
          {
            anchor: this.anchorService.getAnchor(path),
            linkset: links.map((link) => ({
              href: link.href,
              title: link.title,
              hreflang: link.hreflang,
              type: link.type,
            })),
          },
        ],
      });
    } else {
      // Client is requesting a specific link type
      const link = links.find((link) => link.relationType == linkType);
      if (link) return res.redirect(307, link.href);
      else throw new NotFoundException("No link found.");
    }
  }
}
