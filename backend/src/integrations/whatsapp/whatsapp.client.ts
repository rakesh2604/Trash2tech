type WhatsappSendTextParams = {
  toPhone: string; // E.164 without '+'
  text: string;
};

export class WhatsappClient {
  constructor(
    private readonly config: { baseUrl: string; phoneNumberId: string; accessToken: string },
  ) {}

  async sendText(params: WhatsappSendTextParams): Promise<void> {
    // Safe default: no-op if not configured
    if (!this.config.phoneNumberId || !this.config.accessToken) return;

    const url = `${this.config.baseUrl}/v20.0/${this.config.phoneNumberId}/messages`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: params.toPhone,
        type: 'text',
        text: { body: params.text },
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`WhatsApp send failed: ${res.status} ${body}`);
    }
  }
}
