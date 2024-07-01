import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(identifier: string, linkType?: string) {
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

    throw Error("Not implemented!");
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
