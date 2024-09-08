import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";

export class UpsertLinkDto {
  @ApiProperty({
    required: true,
    description: "The relation type of the link.",
  })
  @IsString()
  relationType: string;

  @ApiProperty({
    required: true,
    description: "The href of the link.",
  })
  @IsString()
  href: string;

  @ApiProperty({
    required: true,
    description: "The title of the link.",
  })
  @IsString()
  title: string;

  @ApiProperty({
    required: false,
    description: "The language of the link.",
  })
  @IsArray()
  lang?: string[];
}

export class UpsertLinkSetDto {
  @ApiProperty({
    required: false,
    description: "The ID of the Link Set. This causes an UPDATE, not a CREATE.",
  })
  @IsString()
  id?: string;

  @ApiProperty({
    required: true,
    description: "The identifier of the Link Set.",
  })
  @IsString()
  identifier: string;

  @ApiProperty({
    required: true,
    description: "The qualifier of the Link Set.",
  })
  @IsString()
  qualifier: string;

  @ApiProperty({
    required: true,
    description: "The links of the Link Set.",
    type: [UpsertLinkDto],
  })
  @IsArray()
  @Length(1)
  @ValidateNested({ each: true })
  @Type(() => UpsertLinkDto)
  links: UpsertLinkDto[];
}

export class LinkDto {
  @IsString()
  relationType: string;

  @IsString()
  href: string;

  @IsString()
  title: string;

  @IsArray()
  lang?: string[];

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class LinkSetDto {
  @ApiProperty({
    required: false,
    description: "The ID of the Link Set.",
  })
  @IsString()
  id?: string;

  @ApiProperty({
    required: false,
    description: "The identifier of the Link Set.",
  })
  @IsString()
  identifier?: string;

  @ApiProperty({
    required: false,
    description: "The qualifier of the Link Set.",
  })
  @IsString()
  qualifier: string;

  @ApiProperty({
    required: false,
    description: "The links of the Link Set.",
    type: [LinkDto],
  })
  @IsArray()
  @Length(1)
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  links: LinkDto[];

  @ApiProperty({
    required: false,
    description: "The creation date of the Link Set.",
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    required: false,
    description: "The last update date of the Link Set.",
  })
  @IsDate()
  updatedAt: Date;
}

// Extending for OpenAPI documentation
export class LinkSet extends LinkSetDto {}

export class Link extends LinkDto {}
