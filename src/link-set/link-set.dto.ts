import { LinkType } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsEnum,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";

export class UpsertLinkSetDto {
  @IsString()
  id?: string;

  @IsString()
  identifier: string;

  @IsString()
  qualifier: string;

  @IsArray()
  @Length(1)
  @ValidateNested({ each: true })
  @Type(() => UpsertLinkDto)
  links: UpsertLinkDto[];
}

export class UpsertLinkDto {
  @IsString()
  relationType: string;

  @IsEnum(LinkType)
  type?: LinkType;

  @IsString()
  href?: string;

  @IsString()
  objectKey?: string;

  @IsString()
  title: string;

  @IsArray()
  lang?: string[];
}

export class LinkSetDto {
  @IsString()
  id?: string;

  @IsString()
  identifier?: string;

  @IsString()
  qualifier: string;

  @IsArray()
  @Length(1)
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  links: LinkDto[];

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class LinkDto {
  @IsString()
  relationType: string;

  @IsEnum(LinkType)
  type: LinkType;

  @IsString()
  href?: string;

  @IsString()
  objectKey?: string;

  @IsString()
  title: string;

  @IsArray()
  lang?: string[];

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
