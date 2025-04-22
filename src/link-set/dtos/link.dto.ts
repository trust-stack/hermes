import {ApiProperty, ApiSchema} from "@nestjs/swagger";
import {IsArray, IsDate, IsString} from "class-validator";

@ApiSchema({name: "Link"})
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
