import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(identifier: string, linkType?: string) {
    const linkset = await this.prisma.linkset.findUnique({
      where: { identifier },
      include: { links: true },
    });

    if (!linkset) {
      throw new NotFoundException("Identifier not found");
    }

    if (linkType) {
      const link = linkset.links.find((link) => link.relationType === linkType);
      if (link) {
        return { redirectUrl: link.href };
      } else {
        throw new NotFoundException("Link type not found");
      }
    }

    return linkset;
  }

  async getResolverMetadata() {
    return {
      name: "Hermes Resolver",
      resolverRoot: "https://hermes.trustprovenance.io/",
      supportedLinkType: [
        {
          namespace: "https://hermes.trustprovenance.io/lrt/",
          prefix: "ex",
        },
      ],
    };
  }
}
