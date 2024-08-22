import { Controller, Get, NotFoundException, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { CreateObjectDto, CreateObjectResponseDto } from "./object.dto";
import { ObjectService } from "./object.service";

@Controller()
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Get("/presigned-url")
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
}
