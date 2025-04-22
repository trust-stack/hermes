import {ApiProperty, ApiSchema} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {IsArray, IsString, Length, ValidateNested} from "class-validator";
import {UpsertLinkDto} from "./upsert-link.dto";

@ApiSchema({name: "CreateLinkSet"})
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
  @ValidateNested({each: true})
  @Type(() => UpsertLinkDto)
  links: UpsertLinkDto[];
}
