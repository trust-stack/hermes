import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema({ name: "SetLinkAnchor" })
export class SetLinkAnchorDto {
  @ApiProperty({
    description: "The ID of the link set the link anchor belongs to",
  })
  public linkSetId: string;
}
