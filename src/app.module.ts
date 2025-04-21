import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceModule } from './invoice/invoice.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/invoice-db'),
    ScheduleModule.forRoot(), // فعال‌سازی ماژول زمان‌بندی
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
