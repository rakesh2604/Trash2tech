import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller()
export class RootController {
  @Public()
  @Get()
  getRoot() {
    return {
      message: 'E-Waste Traceability API',
      version: 'v1',
      health: '/api/v1/health',
      docs: 'API base path: /api/v1. Auth: POST /api/v1/auth/login, GET /api/v1/auth/me.',
    };
  }
}
