import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {
  IsArray,
  IsDate,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";

export class ExternalResolverDto {
  @ApiProperty({
    required: true,
    description: "The ID of the External Resolver.",
  })
  @IsString()
  id?: string;

  @ApiProperty({
    required: true,
    description: "The qualifier of the External Resolver.",
  })
  @IsString()
  qualifier: string;

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
    description: "The creation date of the External Resolver.",
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    required: true,
    description: "The last update date of the External Resolver.",
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    required: true,
    description: "The child External Resolvers of the External Resolver.",
    type: () => [ExternalResolverDto],
  })
  @IsArray()
  @Length(1)
  @ValidateNested({each: true})
  @Type(() => ExternalResolverDto)
  childExternalResolvers?: ExternalResolverDto[];
}
