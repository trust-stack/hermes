import {ApiProperty, ApiSchema} from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import {IsValidLinkPath, IsValidLinkType} from "../validators/link.validator";

@ApiSchema({name: "CreateLink"})
export class CreateLinkDto {
  @ApiProperty({
    required: true,
    description: "The path of the Link.",
  })
  @IsNotEmpty()
  @IsString()
  @IsValidLinkPath()
  path: string;

  @ApiProperty({
    required: true,
    description: "The type of the Link.",
  })
  @IsNotEmpty()
  @IsString()
  relationType: string;

  @ApiProperty({
    required: false,
    description: "The title of the Link.",
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    required: true,
    description: "The href of the Link.",
  })
  @IsNotEmpty()
  @IsString()
  href: string;

  @ApiProperty({
    required: false,
    description: "The type of the Link.",
  })
  @IsOptional()
  @IsString()
  @IsValidLinkType()
  type: string;

  @ApiProperty({
    required: false,
    description: "The href language of the Link.",
  })
  @IsOptional()
  @IsArray()
  @IsString({each: true})
  hreflang: string[];

  @ApiProperty({
    required: false,
    description: "Whether the Link is the default Link.",
  })
  @IsOptional()
  @IsBoolean()
  default?: boolean;
}
