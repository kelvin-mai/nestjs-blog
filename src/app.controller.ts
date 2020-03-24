import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AppService } from './app.service';
import { ResponseObject } from './models/response.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/tags')
  @ApiOkResponse({ description: 'List all tags' })
  async findTags(): Promise<ResponseObject<'tags', string[]>> {
    const tags = await this.appService.findTags();
    return { tags };
  }
}
