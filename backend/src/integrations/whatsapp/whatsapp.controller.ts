import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { IsString } from 'class-validator';
import { Public } from '../../auth/decorators/public.decorator';
import { WhatsappService } from './whatsapp.service';

class WhatsappVerifyQueryDto {
  @IsString()
  ['hub.mode']!: string;

  @IsString()
  ['hub.verify_token']!: string;

  @IsString()
  ['hub.challenge']!: string;
}

type WhatsappWebhookBody = {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          from: string;
          text?: { body?: string };
          type?: string;
        }>;
      };
    }>;
  }>;
};

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Public()
  @Get('webhook')
  verifyWebhook(@Query() query: WhatsappVerifyQueryDto) {
    const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || '';
    if (query['hub.verify_token'] !== expected) return 'forbidden';
    return query['hub.challenge'];
  }

  @Public()
  @Post('webhook')
  @HttpCode(200)
  async webhook(@Body() body: WhatsappWebhookBody) {
    const messages =
      body.entry?.flatMap((e) => e.changes ?? []).flatMap((c) => c.value?.messages ?? []) ?? [];

    for (const msg of messages) {
      const text = msg.text?.body;
      if (!text) continue;
      await this.whatsappService.handleIncomingText({ from: msg.from, text });
    }

    return { ok: true };
  }
}
