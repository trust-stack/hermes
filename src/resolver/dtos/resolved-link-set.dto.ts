import {ApiSchema} from "@nestjs/swagger";
import {IsArray, IsString} from "class-validator";

export type ResolvedLinkDto = {
  anchor: string;
} & {
  [key: string]: LinkDto[];
};

@ApiSchema({name: "LinkSet"})
export class ResolvedLinkSetDto {
  @IsString()
  linkSet: ResolvedLinkDto[];
}

@ApiSchema({name: "Link"})
export class LinkDto {
  @IsString()
  href: string;

  @IsString()
  title: string;

  @IsArray()
  hrefLand?: string[];

  @IsString()
  type: string;
}
