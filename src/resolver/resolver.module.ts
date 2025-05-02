import {Module} from "@nestjs/common";
import {PrismaModule} from "../prisma/prisma.module";
import {ResolverController} from "./resolver.controller";

@Module({
  imports: [PrismaModule],
  controllers: [ResolverController],
})
export class ResolverModule {}
