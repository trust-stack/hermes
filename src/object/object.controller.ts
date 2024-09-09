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
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Request, Response } from "express";
import { PaginationDto } from "src/shared/dto";
import {
  CreateObjectDto,
  CreateObjectResponseDto,
  HermesObject,
} from "./object.dto";
import { ObjectService } from "./object.service";

@Controller("objects")
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @ApiOperation({
    operationId: "createObject",
    summary: "Create a new Object",
  })
  @ApiResponse({
    status: 201,
    description: "The key and presigned URL of the Object.",
    type: CreateObjectResponseDto,
  })
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

  @ApiOperation({
    operationId: "getObject",
    summary: "Get an Object by ID",
  })
  @ApiResponse({
    status: 200,
    description: "The Object was found and returned.",
    type: HermesObject,
  })
  @Get(":id")
  async get(@Param("id") id: string) {
    const object = await this.objectService.get(id);
    if (!object) throw new NotFoundException("Object not found.");
    return object;
  }

  @ApiOperation({
    operationId: "getObjects",
    summary: "Get all Objects",
  })
  @ApiResponse({
    status: 200,
    description: "The Objects were found and returned.",
    type: [HermesObject],
  })
  @Get()
  async getMany(@Query() paginationDto: PaginationDto) {
    return this.objectService.getMany(paginationDto);
  }

  @ApiOperation({
    operationId: "deleteObject",
    summary: "Delete an Object by ID",
  })
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.objectService.delete(id);
  }
}
