import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Project } from '../generated/prisma/client.js';
import { ProjectStatus } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    await this.assertNotTaken(dto.name);
    return this.prisma.project.create({ data: dto });
  }

  async findAll(status?: ProjectStatus): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    return project;
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    await this.findOne(id);
    if (dto.name !== undefined) {
      await this.assertNotTaken(dto.name, id);
    }
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.project.delete({ where: { id } });
  }

  private async assertNotTaken(name: string, exceptId?: number): Promise<void> {
    const existing = await this.prisma.project.findFirst({
      where: { name, ...(exceptId ? { id: { not: exceptId } } : {}) },
    });
    if (existing) {
      throw new ConflictException(`Project "${name}" already exists`);
    }
  }
}
