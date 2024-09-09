import { faker } from "@faker-js/faker";
import { Test } from "@nestjs/testing";
import { ExternalResolver, Link, Linkset } from "@prisma/client";
import { ObjectService } from "../object/object.service";
import { PrismaService } from "../prisma/prisma.service";
import { S3Service } from "../s3/s3.service";
import { ResolverService } from "./resolver.service";

describe("ResolverService", () => {
  let resolverService: ResolverService;
  let prismaService: PrismaService;
  let objectService: ObjectService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService, ResolverService, ObjectService, S3Service],
    }).compile();

    resolverService = moduleRef.get<ResolverService>(ResolverService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    objectService = moduleRef.get<ObjectService>(ObjectService);

    // Mock prisma transaction
    jest
      .spyOn(prismaService, "$transaction")
      .mockImplementation((callback) => callback(prismaService));
  });

  describe("resolve", () => {
    describe("link sets", () => {
      beforeEach(() => {
        jest
          .spyOn(prismaService.externalResolver, "findMany")
          .mockResolvedValue([]);
      });

      it("can resolve a single primary identifier and qualifier pair.", async () => {
        const linkSet: Linkset & {
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
              linksetId: "test-link-set",
              type: "HREF",
              objectId: undefined,
            },
          ],
        };

        jest
          .spyOn(prismaService.linkset, "findMany")
          .mockResolvedValue([linkSet as Linkset]);

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

      it("can resolve a single primary identifier and qualifier pair with a OBJECT link type.", async () => {
        const linkSet: Linkset & {
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
              linksetId: "test-link-set",
              type: "OBJECT",
              objectId: "some-key",
            },
          ],
        };

        jest
          .spyOn(prismaService.linkset, "findMany")
          .mockResolvedValue([linkSet as Linkset]);

        jest
          .spyOn(objectService, "generateGetPresignedUrl")
          .mockResolvedValue("https://s3.example.com/some-key");

        expect(await resolverService.resolve("/01/09524000059109")).toEqual({
          linkSet: [
            {
              anchor: "/01/09524000059109",
              "gs1:pip": [
                {
                  href: "https://s3.example.com/some-key",
                  title: "Product Page",
                  lang: ["en"],
                },
              ],
            },
          ],
        });
      });

      it("can resolve a single primary identifier and qualifier pair, with a nested qualifier and identifier.", async () => {
        const primaryLinkSet: Linkset & {
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
              linksetId: "primary-link-set",
              type: "HREF",
              objectId: undefined,
            },
          ],
        };

        const secondaryLinkSet: Linkset & {
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
              linksetId: "secondary-link-set",
              type: "HREF",
              objectId: undefined,
            },
            {
              id: "secondary-foo-link",
              href: "https://example.com/secondary-foo",
              title: "Foo Page",
              relationType: "gs1:foo",
              createdAt: faker.date.recent(),
              updatedAt: faker.date.recent(),
              lang: ["en"],
              linksetId: "secondary-link-set",
              type: "HREF",
              objectId: undefined,
            },
          ],
        };

        jest.spyOn(prismaService.linkset, "findMany").mockResolvedValue([
          // NOTE random order returned
          secondaryLinkSet as Linkset,
          primaryLinkSet as Linkset,
        ]);

        expect(
          await resolverService.resolve("/01/09524000059109/21/1234"),
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
        jest.spyOn(prismaService.linkset, "findMany").mockResolvedValue([]);
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

        jest
          .spyOn(prismaService.externalResolver, "findMany")
          .mockResolvedValue([externalResolver]);

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

        jest
          .spyOn(prismaService.externalResolver, "findMany")
          .mockResolvedValue([secondaryResolver, primaryResolver]);

        expect(await resolverService.resolve("/PIC/NSW123456/FOO/BAR")).toEqual(
          {
            redirectUrl: "https://secondary.com/PIC/NSW123456/FOO/BAR",
          },
        );
      });
    });
  });
});
