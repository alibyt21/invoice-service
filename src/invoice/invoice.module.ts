import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { InvoiceCronService } from './invoice.cron';
import { RabbitMQPublisher } from './invoice.rabbitmq';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
  ],
  providers: [RabbitMQPublisher, InvoiceCronService, InvoiceService],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
