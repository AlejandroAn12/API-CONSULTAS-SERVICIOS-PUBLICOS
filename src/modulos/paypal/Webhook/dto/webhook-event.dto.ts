// paypal/dto/webhook-event.dto.ts
export class WebhookEventDto {
    id: string;
    event_type: string;
    resource_type: string;
    resource: any;
    summary: string;
    create_time: string;
    links: any[];
}