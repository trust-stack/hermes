import {ApiProperty, ApiSchema} from "@nestjs/swagger";
import {IsArray, IsString} from "class-validator";

@ApiSchema({name: "UpsertLink"})
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
