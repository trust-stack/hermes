import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsInt, IsNumber, IsPositive, Max } from "class-validator";

@ApiSchema({ name: "MintManyRequest" })
export class MintManyRequestDto {
  @ApiProperty({
    description: "The number of link anchors to mint",
    required: true,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Max(10000)
  public quantity: number;
}
