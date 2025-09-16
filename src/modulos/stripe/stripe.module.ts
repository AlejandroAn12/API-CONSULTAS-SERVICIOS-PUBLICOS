import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaymentsController } from './stripe.controller';

@Module({
    imports: [PrismaModule],
    providers: [StripeService],
    controllers: [PaymentsController]
})

export class StripeModule { }