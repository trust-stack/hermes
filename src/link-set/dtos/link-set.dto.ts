import {ApiProperty, ApiSchema} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {IsArray, IsDate, IsString, ValidateNested} from "class-validator";
import {LinkDto} from "./link.dto";

@ApiSchema({name: "LinkSet"})
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
    type: () => [LinkDto],
  })
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => LinkDto)
  links: LinkDto[];

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
