import {Inject, Injectable} from "@nestjs/common";
import {ExternalResolver, Link, Prisma, PrismaClient} from "@prisma/client";
import {mapValues} from "lodash";
import {appConfig, AppConfig} from "../config";
import {LinkSet, linkSetToUrl} from "../link-set/utils";
import {LinkDto, ResolvedLinkSetDto} from "./dtos";
import {parseUrlPath} from "./utils";

// UUID v4 regex pattern
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class LinkResolverService {
  constructor(
    @Inject("PRISMA_CLIENT") private readonly prisma: PrismaClient,
    @Inject(appConfig.KEY) private readonly config: AppConfig
  ) {}

  async resolve(
    path: string,
    linkType?: string
  ): Promise<{redirectUrl: string} | ResolvedLinkSetDto> {
    const potentialUuid = path.replace("/", "");

    // Check if the identifier is a UUID
    if (UUID_PATTERN.test(potentialUuid)) {
      // Look up the LinkAnchor
      const linkAnchor = await this.prisma.linkAnchor.findUnique({
        where: {id: potentialUuid},
        include: {
          linkSet: {
            include: {
              links: true,
              childLinkSets: {
                include: {
                  links: true,
                },
              },
            },
          },
        },
      });

      // If we found a LinkAnchor with an associated LinkSet
      if (linkAnchor?.linkSet) {
        // Construct a LinkSet structure
        const linkSetStructure: LinkSet = {
          qualifier: linkAnchor.linkSet.qualifier,
          identifier: linkAnchor.linkSet.identifier,
          childLinkSets: linkAnchor.linkSet.childLinkSets.map((child) => ({
            qualifier: child.qualifier,
            identifier: child.identifier,
            childLinkSets: [],
          })),
        };

        // Generate the URL path from the LinkSet
        const urlPath = linkSetToUrl(linkSetStructure);

        return {
          redirectUrl: `${urlPath}`,
        };
      }
    }

    const segments = parseUrlPath(path);

    if (segments.length === 0) {
      return null;
    }

    // Extract primary qualifier/identifier pair
    const {qualifier: primaryQualifier, identifier: primaryIdentifier} =
      segments[0];

    // Construct where clause
    const linkSetWhere: Prisma.LinkSetWhereInput = {
      OR: [{qualifier: primaryQualifier, identifier: primaryIdentifier}],
    };

    const externalWhere: Prisma.ExternalResolverWhereInput = {
      OR: [{qualifier: primaryQualifier}],
    };

    // Starting from the second segment
    for (let i = 1; i < segments.length; i++) {
      const {qualifier, identifier} = segments[i];

      linkSetWhere.OR.push({
        qualifier,
        identifier,
        parentLinkSet: {
          // Child of previous qualifier/identifier
          identifier: segments[i - 1].identifier,
          qualifier: segments[i - 1].qualifier,
        },
      });

      externalWhere.OR.push({
        qualifier,
        parentExternalResolver: {
          qualifier: segments[i - 1].qualifier,
        },
      });
    }

    // TODO: This can be simplified, but
    // unsure how to mock prisma.$transaction([prisma.linkSet.findMany, prisma.externalResolver.findMany])
    const [linkSets, externalResolvers] = await this.prisma.$transaction(
      (tx) => {
        return Promise.all([
          tx.linkSet.findMany({
            where: linkSetWhere,
            include: {
              links: true,
            },
          }),
          tx.externalResolver.findMany({
            where: externalWhere,
          }),
        ]);
      }
    );

    const treeNodes: ResolverTreeNode[] = [];
    const rootIds: string[] = [];

    // Sort external resolvers such that parents come first
    const sortedExternalResolvers = externalResolvers.sort((a, b) => {
      if (a.parentExternalResolverId && !b.parentExternalResolverId) return 1;
      else if (!a.parentExternalResolverId && b.parentExternalResolverId)
        return -1;

      return 0;
    });

    sortedExternalResolvers.forEach((resolver) => {
      const node = new ResolverTreeNode(
        resolver,
        !resolver.parentExternalResolverId
      );

      treeNodes.push(node);

      // Find parent and add as child
      if (!!resolver.parentExternalResolverId) {
        const parent = treeNodes.find(
          (node) => node.id == resolver.parentExternalResolverId
        );

        parent.addChild(node);
      }
      // Else, mark and track root
      else {
        rootIds.push(node.id);
      }
    });

    // Extract root nodes
    const rootNodes = treeNodes.filter((node) => rootIds.includes(node.id));
    let maxDepth = -1;
    let maxDepthNode: ResolverTreeNode;

    function traverseTree(
      node: ResolverTreeNode,
      nodes: ResolverTreeNode[],
      depth: number
    ) {
      const {identifier} = segments[depth];

      // If pattern matches, traverse to child
      if (new RegExp(node.resolver.pattern).test(identifier)) {
        // Check if this is the deepest node
        if (depth > maxDepth) {
          maxDepth = depth;
          maxDepthNode = node;
        }

        node.children.forEach((child) => {
          traverseTree(child, nodes, depth + 1);
        });
      }
    }

    // For all resolver trees found, traverse and find greatest depth
    rootNodes.forEach((root) => {
      traverseTree(root, treeNodes, 0);
    });

    if (maxDepthNode) {
      return {
        redirectUrl: `${maxDepthNode.resolver.href}${path}`,
      };
    }

    // Sort link sets by depth in requested url path
    const sortedLinkSets = linkSets.sort((a, b) => {
      const indexA = segments.findIndex(
        (seg) => seg.identifier == a.identifier && seg.qualifier == a.qualifier
      );

      const indexB = segments.findIndex(
        (seg) => seg.identifier == b.identifier && seg.qualifier == b.qualifier
      );

      return indexA - indexB;
    });

    // Flatten link sets returned
    const flattenedLinks: {[relationType: string]: Link[]} = {};

    for (const linkSet of sortedLinkSets) {
      for (const link of linkSet.links) {
        if (!flattenedLinks[link.relationType])
          flattenedLinks[link.relationType] = [];
        flattenedLinks[link.relationType].push(link);
      }
    }

    // sortedLinkSets.forEach((linkSet) => {
    //   linkSet.links.forEach((link) => {
    //     if (!flattenedLinks[link.relationType])
    //       flattenedLinks[link.relationType] = [];
    //     flattenedLinks[link.relationType].push(link);
    //   });
    // });

    const mappedLinks = mapValues(flattenedLinks, (links) =>
      links.map(
        (l) =>
          ({
            href: l.href,
            title: l.title,
            lang: l.lang,
          }) as LinkDto
      )
    );

    return {
      linkSet: [
        // @ts-ignore
        // TODO: how to get class-validator to work with key-values
        {
          // TODO: construct anchor url
          anchor: path,
          ...mappedLinks,
        },
      ],
    };
  }

  async getResolverMetadata() {
    return {
      name: this.config.resolverName,
      resolverRoot: this.config.resolverRoot,
      supportedLinkType: [],
    };
  }
}

class ResolverTreeNode {
  public children: ResolverTreeNode[] = [];

  public get id() {
    return this.resolver.id;
  }

  constructor(
    public resolver: ExternalResolver,
    public root?: boolean
  ) {}

  addChild(node: ResolverTreeNode) {
    this.children.push(node);
  }
}
