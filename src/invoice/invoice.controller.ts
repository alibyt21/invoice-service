import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() body: any) {
    return this.invoiceService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findById(id);
  }

  @Get()
  findAll(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.invoiceService.findAll({ startDate, endDate });
  }
}
