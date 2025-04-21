import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitMQPublisher {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'daily_sales_report',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  async publish(report: any) {
    return this.client.emit('daily_sales_report', report).toPromise();
  }
}
