import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {IsArray, IsOptional, IsString, ValidateNested} from "class-validator";

export class CreateExternalResolverDto {
  @ApiProperty({
    required: true,
    description: "The href of the External Resolver.",
  })
  @IsString()
  href: string;

  @ApiProperty({
    required: true,
    description: "The pattern of the External Resolver.",
  })
  @IsString()
  pattern: string;

  @ApiProperty({
    required: true,
    description: "The qualifier of the External Resolver.",
  })
  @IsString()
  qualifier: string;

  @ApiProperty({
    required: true,
    description: "The creation data of the External Resolver.",
  })
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => CreateExternalResolverDto)
  @IsOptional()
  childExternalResolvers?: CreateExternalResolverDto[];
}
