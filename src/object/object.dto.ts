import { IsInt, IsString } from "class-validator";

export class CreateObjectDto {
  @IsString()
  name: string;

  @IsString()
  mimeType: string;

  @IsInt()
  size: number;
}

export class CreateObjectResponseDto {
  @IsString()
  key: string;

  @IsString()
  presignedUrl: string;
}

export class ObjectDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  mimeType: string;

  @IsInt()
  size: number;

  @IsString()
  url: string;
}
