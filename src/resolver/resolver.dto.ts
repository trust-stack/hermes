import { Type } from "class-transformer";
import { IsArray, IsString, Min } from "class-validator";

export class ResolvedLinkSetDto {
  @IsArray()
  @Min(1)
  @Type(() => LinkDto)
  linkSet: ResolvedLinkDto[];
}

export type ResolvedLinkDto = {
  anchor: string;
} & {
  [key: string]: LinkDto[];
};

export class LinkDto {
  @IsString()
  href: string;

  @IsString()
  title: string;

  @IsArray()
  lang?: string[];
}
