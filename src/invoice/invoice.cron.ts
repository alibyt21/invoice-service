import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { RabbitMQPublisher } from './invoice.rabbitmq';

@Injectable()
export class InvoiceCronService {
  private readonly logger = new Logger(InvoiceCronService.name);

  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    private readonly rabbitMQPublisher: RabbitMQPublisher,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const invoices = await this.invoiceModel.find({
      date: { $gte: start, $lte: end },
    });

    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);

    const skuMap: Record<string, number> = {};
    invoices.forEach((inv) => {
      inv.items.forEach((item) => {
        skuMap[item.sku] = (skuMap[item.sku] || 0) + item.qt;
      });
    });

    const report = {
      totalSalesAmount: totalAmount,
      items: Object.entries(skuMap).map(([sku, qt]) => ({ sku, quantity: qt })),
      date: new Date().toISOString().split('T')[0],
    };

    await this.rabbitMQPublisher.publish(report);

    this.logger.log(`📦 Report sent to RabbitMQ: ${JSON.stringify(report)}`);
  }
}
