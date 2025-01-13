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
  href?: string;

  @ApiProperty({
    required: false,
    description: "The object key of the link, if TYPE is OBJECT.",
  })
  @IsString()
  objectKey?: string;

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

export class CreateLinkSetDto {
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

export class UpdateLinkSetDto extends CreateLinkSetDto {
  @ApiProperty({
    required: false,
    description: "The ID of the Link Set. This causes an UPDATE, not a CREATE.",
  })
  @IsString()
  id?: string;
}

export class LinkDto {
  @ApiProperty({
    required: true,
    description: "The relation type of the link.",
  })
  @IsString()
  relationType: string;

  @ApiProperty({
    required: false,
    description: "The href of the link.",
  })
  @IsString()
  href?: string;

  @ApiProperty({
    required: false,
    description: "The object key of the link, if TYPE is OBJECT.",
  })
  @IsString()
  objectKey?: string;

  @ApiProperty({
    required: true,
    description: "The title of the link",
  })
  @IsString()
  title: string;

  @ApiProperty({
    required: false,
    description: "The language of the link.",
  })
  @IsArray()
  lang?: string[];

  @ApiProperty({
    required: true,
    description: "The creation date of the Link.",
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    required: true,
    description: "The last update date of the Link.",
  })
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
    required: true,
    description: "The qualifier of the Link Set.",
  })
  @IsString()
  qualifier: string;

  @ApiProperty({
    required: true,
    description: "The links of the Link Set.",
    type: () => [Link],
  })
  @IsArray()
  @Length(1)
  @ValidateNested({ each: true })
  @Type(() => Link)
  links: Link[];

  @ApiProperty({
    required: true,
    description: "The creation date of the Link Set.",
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    required: true,
    description: "The last update date of the Link Set.",
  })
  @IsDate()
  updatedAt: Date;
}

// Extending for OpenAPI documentation
export class LinkSet extends LinkSetDto {}

export class Link extends LinkDto {}
