import {faker} from "@faker-js/faker";
import {Test} from "@nestjs/testing";
import {ExternalResolver, Link, LinkSet, PrismaClient} from "@prisma/client";
import {vi} from "vitest";
import {appConfig} from "../../src/config";
import {LinkResolverService} from "./link-resolver.service";

describe("LinkResolverService", () => {
  let resolverService: LinkResolverService;
  let prismaService: PrismaClient;

  const mockPrismaService = {
    linkSet: {
      findMany: vi.fn(),
    },
    externalResolver: {
      findMany: vi.fn(),
    },
    $transaction: vi.fn().mockImplementation((callback) => {
      return callback(mockPrismaService);
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LinkResolverService,
        {
          provide: "PRISMA_CLIENT",
          useValue: mockPrismaService,
        },
        {
          provide: appConfig.KEY,
          useValue: {},
        },
      ],
    }).compile();

    resolverService = moduleRef.get<LinkResolverService>(LinkResolverService);
    prismaService = moduleRef.get<PrismaClient>("PRISMA_CLIENT");
  });

  describe("resolve", () => {
    describe("link sets", () => {
      beforeEach(() => {
        vi.spyOn(prismaService.externalResolver, "findMany").mockResolvedValue(
          []
        );
      });

      it("can resolve a single primary identifier and qualifier pair.", async () => {
        const linkSet: LinkSet & {
          links: Link[];
        } = {
          id: "test-link-set",
          qualifier: "01",
          identifier: "09524000059109",
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
          parentLinkSetId: undefined,
          links: [
            {
              id: "test-link",
              href: "https://example.com",
              title: "Product Page",
              relationType: "gs1:pip",
              createdAt: faker.date.recent(),
              updatedAt: faker.date.recent(),
              lang: ["en"],
              linkSetId: "test-link-set",
            },
          ],
        };

        vi.spyOn(prismaService.linkSet, "findMany").mockResolvedValue([
          linkSet as LinkSet,
        ]);

        expect(await resolverService.resolve("/01/09524000059109")).toEqual({
          linkSet: [
            {
              anchor: "/01/09524000059109",
              "gs1:pip": [
                {
                  href: "https://example.com",
                  title: "Product Page",
                  lang: ["en"],
                },
              ],
            },
          ],
        });
      });

      it("can resolve a single primary identifier and qualifier pair, with a nested qualifier and identifier.", async () => {
        const primaryLinkSet: LinkSet & {
          links: Link[];
        } = {
          id: "primary-link-set",
          qualifier: "01",
          identifier: "09524000059109",
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
          parentLinkSetId: undefined,
          links: [
            {
              id: "primary-link",
              href: "https://example.com/primary",
              title: "Primary Product Page",
              relationType: "gs1:pip",
              createdAt: faker.date.recent(),
              updatedAt: faker.date.recent(),
              lang: ["en"],
              linkSetId: "primary-link-set",
            },
          ],
        };

        const secondaryLinkSet: LinkSet & {
          links: Link[];
        } = {
          id: "secondary-link-set",
          qualifier: "21",
          identifier: "1234",
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
          parentLinkSetId: "primary-link-set",
          links: [
            {
              id: "secondary-pip-link",
              href: "https://example.com/secondary",
              title: "Secondary Product Page",
              relationType: "gs1:pip",
              createdAt: faker.date.recent(),
              updatedAt: faker.date.recent(),
              lang: ["en"],
              linkSetId: "secondary-link-set",
            },
            {
              id: "secondary-foo-link",
              href: "https://example.com/secondary-foo",
              title: "Foo Page",
              relationType: "gs1:foo",
              createdAt: faker.date.recent(),
              updatedAt: faker.date.recent(),
              lang: ["en"],
              linkSetId: "secondary-link-set",
            },
          ],
        };

        vi.spyOn(prismaService.linkSet, "findMany").mockResolvedValue([
          // NOTE random order returned
          secondaryLinkSet as LinkSet,
          primaryLinkSet as LinkSet,
        ]);

        expect(
          await resolverService.resolve("/01/09524000059109/21/1234")
        ).toEqual({
          linkSet: [
            {
              anchor: "/01/09524000059109/21/1234",
              // Assert: gs1:pip links are concatenated
              "gs1:pip": [
                {
                  href: "https://example.com/primary",
                  title: "Primary Product Page",
                  lang: ["en"],
                },
                {
                  href: "https://example.com/secondary",
                  title: "Secondary Product Page",
                  lang: ["en"],
                },
              ],
              // Assert: secondary link added and returned
              "gs1:foo": [
                {
                  href: "https://example.com/secondary-foo",
                  title: "Foo Page",
                  lang: ["en"],
                },
              ],
            },
          ],
        });
      });
    });

    describe("external resolvers.", () => {
      beforeEach(() => {
        vi.spyOn(prismaService.linkSet, "findMany").mockResolvedValue([]);
      });

      it("can pattern match a primary qualifier and identifier.", async () => {
        const externalResolver: ExternalResolver = {
          id: "test-resolver",
          pattern: `^(N).*`,
          href: "https://primary.com",
          qualifier: "PIC",
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
          parentExternalResolverId: undefined,
        };

        vi.spyOn(prismaService.externalResolver, "findMany").mockResolvedValue([
          externalResolver,
        ]);

        expect(await resolverService.resolve("/PIC/NSW123456")).toEqual({
          redirectUrl: "https://primary.com/PIC/NSW123456",
        });
      });

      it("can pattern match a primary qualifier and identifier, with a nested qualifier and identifier.", async () => {
        const primaryResolver: ExternalResolver = {
          id: "primary-resolver",
          pattern: `^(N).*`,
          href: "https://primary.com",
          qualifier: "PIC",
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
          parentExternalResolverId: undefined,
        };

        const secondaryResolver: ExternalResolver = {
          id: "secondary-resolver",
          pattern: `^(BAR).*`,
          href: "https://secondary.com",
          qualifier: "FOO",
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
          parentExternalResolverId: "primary-resolver",
        };

        vi.spyOn(prismaService.externalResolver, "findMany").mockResolvedValue([
          secondaryResolver,
          primaryResolver,
        ]);

        expect(await resolverService.resolve("/PIC/NSW123456/FOO/BAR")).toEqual(
          {
            redirectUrl: "https://secondary.com/PIC/NSW123456/FOO/BAR",
          }
        );
      });
    });
  });
});
