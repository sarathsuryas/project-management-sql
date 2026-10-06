import { IsEnum, IsOptional } from 'class-validator';
import { ProjectStatus } from '../../generated/prisma/enums.js';

export class QueryProjectsDto {
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
