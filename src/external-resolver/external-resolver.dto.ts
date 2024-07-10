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
  href: string;

  @IsString()
  pattern: string;
}

export class UpsertExternalResolverSetDto {
  @IsString()
  id?: string;

  @IsString()
  pattern: string;

  @IsArray()
  @Length(1)
  @ValidateNested({ each: true })
  @Type(() => UpsertExternalResolverDto)
  resolvers: UpsertExternalResolverDto[];
}

export class ExternalResolverDto {
  @IsString()
  href: string;

  @IsString()
  pattern: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class ExternalResolverSetDto {
  @IsString()
  id?: string;

  @IsString()
  pattern: string;

  @IsArray()
  @Length(1)
  @ValidateNested({ each: true })
  @Type(() => ExternalResolverDto)
  resolvers: ExternalResolverDto[];

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
