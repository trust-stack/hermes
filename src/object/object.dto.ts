import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateObjectDto {
  @ApiProperty({
    required: true,
    description: "The name of the object",
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    description: "The MIME type of the object",
  })
  @IsString()
  mimeType: string;

  @ApiProperty({
    required: true,
    description: "The size of the object",
  })
  @IsInt()
  size: number;
}

export class CreateObjectResponseDto {
  @ApiProperty({
    required: true,
    description: "The ID of the object to be created.",
  })
  @IsString()
  key: string;

  @ApiProperty({
    required: true,
    description: "The presigned URL to upload the object to.",
  })
  @IsString()
  presignedUrl: string;
}

export class ObjectDto {
  @ApiProperty({
    required: true,
    description: "The ID of the object",
  })
  @IsString()
  id: string;

  @ApiProperty({
    required: true,
    description: "The name of the object",
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    description: "The MIME type of the object",
  })
  @IsString()
  mimeType: string;

  @ApiProperty({
    required: true,
    description: "The size of the object",
  })
  @IsInt()
  size: number;

  @ApiProperty({
    required: true,
    description: "A presigned URL of the fetch the object",
  })
  @IsString()
  url: string;
}

// Extending for OpenAPI documentation
export class HermesObject extends ObjectDto {}
