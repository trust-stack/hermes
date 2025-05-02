import {Inject, Injectable} from "@nestjs/common";
import {ConfigType} from "@nestjs/config";
import {appConfig} from "../config";

@Injectable()
export class AnchorService {
  constructor(
    @Inject(appConfig.KEY) private config: ConfigType<typeof appConfig>
  ) {}

  public getAnchor(path: string): string {
    return `${this.config.RESOLVER_ROOT}${path}`;
  }

  public getResolverRoot(): string {
    return this.config.RESOLVER_ROOT;
  }

  public getResolverName(): string {
    return this.config.RESOLVER_NAME;
  }
}
