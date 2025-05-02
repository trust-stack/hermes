import {ApiProperty, ApiSchema} from "@nestjs/swagger";

@ApiSchema({name: "LinkConfiguration"})
export class LinkConfigurationDto {
  @ApiProperty({
    required: true,
    description: "The id of the Link.",
  })
  id: string;

  @ApiProperty({
    required: true,
    description: "The created at date of the Link.",
  })
  createdAt: Date;

  @ApiProperty({
    required: true,
    description: "The updated at date of the Link.",
  })
  updatedAt: Date;

  @ApiProperty({
    required: true,
    description: "The path of the Link.",
  })
  path: string;

  @ApiProperty({
    required: true,
    description: "The type of the Link.",
  })
  type: string;

  @ApiProperty({
    required: false,
    description: "The title of the Link.",
  })
  title: string;

  @ApiProperty({
    required: true,
    description: "The href of the Link.",
  })
  href: string;

  @ApiProperty({
    required: false,
    description: "The href of the Link.",
  })
  hrefLang: string[];
}
