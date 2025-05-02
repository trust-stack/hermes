import {Module} from "@nestjs/common";
import {PrismaModule} from "../prisma/prisma.module";
import {AnchorService} from "./anchor.service";
import {ResolverController} from "./resolver.controller";

@Module({
  imports: [PrismaModule],
  controllers: [ResolverController],
  providers: [AnchorService],
})
export class ResolverModule {}
