import { Inject, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import * as DataLoader from "dataloader";

export interface IHrefBuilderService {
  buildHref(id: string): Promise<string>;
}

@Injectable()
export class HrefBuilderService implements IHrefBuilderService {
  private loader = new DataLoader(async (ids: string[]) => {
    return this.loaderFunction(ids);
  });

  constructor(@Inject("PRISMA_CLIENT") private readonly prisma: PrismaClient) {}

  async buildHref(id: string): Promise<string | undefined> {
    return this.loader.load(id);
  }

  private async loaderFunction(ids: string[]): Promise<string[]> {
    const links = await this.prisma.link.findMany({
      where: { id: { in: ids } },
    });

    return ids?.map((id) => links.find((link) => link.id === id)?.href);
  }
}
