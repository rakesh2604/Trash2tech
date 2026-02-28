import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REDIS_CLIENT } from '../../cache/redis.module';
import {
  BookingChannel,
  BookingRequest,
  BookingRequestStatus,
} from '../../entities/booking-request.entity';
import { PickupSourceChannel } from '../../entities/pickup.entity';
import { CitizenType } from '../../entities/citizen.entity';
import { PickupService } from '../../pickups/pickup.service';
import { WhatsappClient } from './whatsapp.client';
import type Redis from 'ioredis';

type WhatsappIncomingText = { from: string; text: string };

type BookingState =
  | { step: 'INIT' }
  | { step: 'ASK_NAME' }
  | { step: 'ASK_LINE1'; name: string }
  | { step: 'ASK_CITY'; name: string; line1: string }
  | { step: 'ASK_STATE'; name: string; line1: string; city: string }
  | { step: 'ASK_PINCODE'; name: string; line1: string; city: string; state: string }
  | { step: 'DONE' };

function stateKey(phone: string) {
  return `wa:booking:${phone}`;
}

@Injectable()
export class WhatsappService {
  private readonly client: WhatsappClient;

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @InjectRepository(BookingRequest)
    private readonly bookingRepo: Repository<BookingRequest>,
    private readonly pickupService: PickupService,
  ) {
    this.client = new WhatsappClient({
      baseUrl: process.env.WHATSAPP_BSP_BASE_URL || 'https://graph.facebook.com',
      phoneNumberId: process.env.WHATSAPP_BSP_PHONE_NUMBER_ID || '',
      accessToken: process.env.WHATSAPP_BSP_ACCESS_TOKEN || '',
    });
  }

  async handleIncomingText(msg: WhatsappIncomingText) {
    const from = msg.from.replace('+', '');
    const text = msg.text.trim();

    const raw = await this.redis.get(stateKey(from));
    const state: BookingState = raw ? (JSON.parse(raw) as BookingState) : { step: 'INIT' };

    if (state.step === 'INIT') {
      await this.redis.set(
        stateKey(from),
        JSON.stringify({ step: 'ASK_NAME' } satisfies BookingState),
        'EX',
        60 * 30,
      );
      await this.client.sendText({
        toPhone: from,
        text: 'To book an e-waste pickup, reply with your name.',
      });
      await this.bookingRepo.save(
        this.bookingRepo.create({
          channel: BookingChannel.WHATSAPP,
          phone: from,
          pincode: null,
          categoryHint: null,
          payloadJson: { startedAt: new Date().toISOString() },
          status: BookingRequestStatus.OPEN,
          pickupId: null,
        }),
      );
      return { ok: true };
    }

    if (state.step === 'ASK_NAME') {
      const next: BookingState = { step: 'ASK_LINE1', name: text };
      await this.redis.set(stateKey(from), JSON.stringify(next), 'EX', 60 * 30);
      await this.client.sendText({
        toPhone: from,
        text: 'Share pickup address line 1 (house/flat, street).',
      });
      return { ok: true };
    }

    if (state.step === 'ASK_LINE1') {
      const next: BookingState = { step: 'ASK_CITY', name: state.name, line1: text };
      await this.redis.set(stateKey(from), JSON.stringify(next), 'EX', 60 * 30);
      await this.client.sendText({ toPhone: from, text: 'City?' });
      return { ok: true };
    }

    if (state.step === 'ASK_CITY') {
      const next: BookingState = {
        step: 'ASK_STATE',
        name: state.name,
        line1: state.line1,
        city: text,
      };
      await this.redis.set(stateKey(from), JSON.stringify(next), 'EX', 60 * 30);
      await this.client.sendText({ toPhone: from, text: 'State?' });
      return { ok: true };
    }

    if (state.step === 'ASK_STATE') {
      const next: BookingState = {
        step: 'ASK_PINCODE',
        name: state.name,
        line1: state.line1,
        city: state.city,
        state: text,
      };
      await this.redis.set(stateKey(from), JSON.stringify(next), 'EX', 60 * 30);
      await this.client.sendText({ toPhone: from, text: 'Pincode?' });
      return { ok: true };
    }

    if (state.step === 'ASK_PINCODE') {
      const pincode = text.replace(/\s+/g, '');
      const hubId = process.env.DEFAULT_HUB_ID;
      if (!hubId) {
        await this.client.sendText({
          toPhone: from,
          text: 'Booking received. Our team will call you to confirm pickup details.',
        });
        await this.redis.del(stateKey(from));
        return { ok: true };
      }

      const pickup = await this.pickupService.createPickup(
        {
          hubId,
          sourceChannel: PickupSourceChannel.WHATSAPP,
          citizenType: CitizenType.INDIVIDUAL,
          citizenName: state.name,
          citizenPhone: from,
          address: {
            line1: state.line1,
            city: state.city,
            state: state.state,
            pincode,
          },
          notes: 'WhatsApp booking',
        },
        null,
      );

      await this.client.sendText({
        toPhone: from,
        text: `Pickup booked. Your Pickup ID is ${pickup.pickupCode}. We will contact you to schedule.`,
      });

      await this.redis.del(stateKey(from));
      await this.bookingRepo.save(
        this.bookingRepo.create({
          channel: BookingChannel.WHATSAPP,
          phone: from,
          pincode,
          categoryHint: null,
          payloadJson: { completedAt: new Date().toISOString(), pickupCode: pickup.pickupCode },
          status: BookingRequestStatus.CONVERTED_TO_PICKUP,
          pickupId: pickup.id,
        }),
      );

      return { ok: true, pickupId: pickup.id };
    }

    await this.redis.del(stateKey(from));
    return { ok: true };
  }
}
