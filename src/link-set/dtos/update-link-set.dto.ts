import {ApiSchema} from "@nestjs/swagger";
import {CreateLinkSetDto} from "./create-link-set.dto";

@ApiSchema({name: "UpdateLinkSet"})
export class UpdateLinkSetDto extends CreateLinkSetDto {}
