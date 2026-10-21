import { Controller, Get, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { healthResponseSchema } from '@commercehub/validation';
import type { HealthResponse } from '@commercehub/types';

@Controller('health')
@ApiTags('health')
export class HealthController {
  @Get()
  @Version(VERSION_NEUTRAL)
  @ApiOkResponse({
    standardSchema: healthResponseSchema,
    description: 'Process health only; no dependency readiness.',
  })
  health(): HealthResponse {
    return { status: 'ok' };
  }
}
