import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";

export class UpsertExternalResolverDto {
  @IsString()
  id?: string;

  @IsString()
  href: string;

  @IsString()
  pattern: string;

  @IsString()
  qualifier: string;

  @IsArray()
  @Length(1)
  @ValidateNested({ each: true })
  @Type(() => UpsertExternalResolverDto)
  childExternalResolvers?: UpsertExternalResolverDto[];
}

export class ExternalResolverDto {
  @IsString()
  id?: string;

  @IsString()
  qualifier: string;

  @IsString()
  href: string;

  @IsString()
  pattern: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsArray()
  @Length(1)
  @ValidateNested({ each: true })
  @Type(() => ExternalResolverDto)
  childExternalResolvers?: ExternalResolverDto[];
}
