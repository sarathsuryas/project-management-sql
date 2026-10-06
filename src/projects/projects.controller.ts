import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { Project } from '../generated/prisma/client.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { QueryProjectsDto } from './dto/query-projects.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ProjectsService } from './projects.service.js';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Post()
  create(@Body() dto: CreateProjectDto): Promise<Project> {
    return this.projects.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryProjectsDto): Promise<Project[]> {
    return this.projects.findAll(query.status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return this.projects.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ): Promise<Project> { 
    return this.projects.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.projects.remove(id);
  }
}
