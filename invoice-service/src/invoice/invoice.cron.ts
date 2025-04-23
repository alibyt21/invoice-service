import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { RabbitMQPublisher } from './invoice.rabbitmq';

@Injectable()
export class InvoiceCronService {
  // Create a logger instance for this service
  private readonly logger = new Logger(InvoiceCronService.name);

  constructor(
    // Inject the Mongoose model for invoices
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    // Inject the RabbitMQ publisher service
    private readonly rabbitMQPublisher: RabbitMQPublisher,
  ) {}

  // Run this method every day at noon
  @Cron(CronExpression.EVERY_DAY_AT_NOON) // Can be changed to EVERY_30_SECONDS for testing
  async handleCron() {
    // Define start of the day (00:00:00.000)
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    // Define end of the day (23:59:59.999)
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Fetch invoices created within today's date range
    const invoices = await this.invoiceModel.find({
      date: { $gte: start, $lte: end },
    });

    // Calculate total sales amount from all invoices
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);

    // Create a map to accumulate quantities per SKU
    const skuMap: Record<string, number> = {};
    invoices.forEach((inv) => {
      inv.items.forEach((item) => {
        skuMap[item.sku] = (skuMap[item.sku] || 0) + item.qt;
      });
    });

    // Construct the report object to be sent
    const report = {
      totalSalesAmount: totalAmount,
      items: Object.entries(skuMap).map(([sku, qt]) => ({ sku, quantity: qt })),
      date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    };

    // Publish the report to RabbitMQ
    await this.rabbitMQPublisher.publish(report);

    // Log the published report
    this.logger.log(`📦 Report sent to RabbitMQ: ${JSON.stringify(report)}`);
  }
}
