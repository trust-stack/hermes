import { Injectable } from "@nestjs/common";
import { groupBy, mapValues } from "lodash";
import { PrismaService } from "../prisma/prisma.service";
import { LinkDto, ResolvedLinkSetDto } from "./resolver.dto";

@Injectable()
export class ResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(
    identifier: string,
    linkType?: string,
  ): Promise<{ redirectUrl: string } | ResolvedLinkSetDto> {
    // Load external resolver configurations
    const resolverConfigs = await this.prisma.externalResolverSet.findMany({
      include: {
        resolvers: true,
      },
    });

    for (const config of resolverConfigs) {
      // Test parent configuration
      const parentPattern = new RegExp(config.pattern);

      // Test child configurations
      if (parentPattern.test(identifier)) {
        for (const resolver of config.resolvers) {
          const childPattern = new RegExp(resolver.pattern);
          if (childPattern.test(identifier)) {
            return {
              redirectUrl: `${resolver.href}/${identifier}`,
            };
          }
        }
      }
    }

    const linkSet = await this.prisma.linkset.findUnique({
      where: { identifier },
      include: {
        links: true,
      },
    });

    const groupedLinkType = groupBy(linkSet?.links, (l) => l.relationType);

    const mappedLinks = mapValues(groupedLinkType, (links) =>
      links.map(
        (l) =>
          ({
            href: l.href,
            title: l.title,
            lang: l.lang,
          }) as LinkDto,
      ),
    );

    return {
      linkSet: [
        // @ts-ignore
        // TODO: how to get class-validator to work with key-values
        {
          // TODO: construct anchor url
          anchor: identifier,
          ...mappedLinks,
        },
      ],
    };
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
