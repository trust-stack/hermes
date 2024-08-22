import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import { PaginationDto } from "src/shared/dto";
import { CreateObjectDto, CreateObjectResponseDto } from "./object.dto";
import { ObjectService } from "./object.service";

@Controller("objects")
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Post()
  async resolve(
    @Req() request: Request<CreateObjectDto>,
    @Res() res: Response<CreateObjectResponseDto>,
  ) {
    try {
      const result = await this.objectService.createObject(request.body);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundException)
        return { statusCode: 404, message: error.message };

      throw error;
    }
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const object = await this.objectService.get(id);
    if (!object) throw new NotFoundException("Object not found.");
    return object;
  }

  @Get()
  async getMany(@Query() paginationDto: PaginationDto) {
    return this.objectService.getMany(paginationDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.objectService.delete(id);
  }
}
