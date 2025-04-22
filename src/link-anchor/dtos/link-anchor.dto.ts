import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

@ApiSchema({ name: "LinkAnchor" })
export class LinkAnchorDto {
  @ApiProperty({ description: "The ID of the link anchor" })
  public id: string;

  @ApiProperty({ description: "The date and time the link anchor was created" })
  public createdAt: Date;

  @ApiProperty({ description: "The date and time the link anchor was updated" })
  public updatedAt: Date;

  @ApiProperty({
    description: "The ID of the link set the link anchor belongs to",
    required: false,
  })
  @IsOptional()
  public linkSetId?: string;
}
