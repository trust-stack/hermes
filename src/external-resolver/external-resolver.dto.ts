import { Type } from "class-transformer";
import { IsArray, IsString, Length, ValidateNested } from "class-validator";

export class ExternalResolverDto {
  @IsString()
  href: string;

  @IsString()
  pattern: string;
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
}
