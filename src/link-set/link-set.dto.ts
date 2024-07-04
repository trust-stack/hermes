import { Type } from "class-transformer";
import { IsArray, IsString, Length, ValidateNested } from "class-validator";

export class LinkSetDto {
  @IsString()
  id?: string;

  @IsString()
  identifier?: string;

  @IsArray()
  @Length(1)
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  links: LinkDto[];
}

export class LinkDto {
  @IsString()
  relationType: string;

  @IsString()
  href: string;

  @IsString()
  title: string;

  @IsArray()
  lang?: string[];
}
