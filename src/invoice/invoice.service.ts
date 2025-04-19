import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}

  async create(invoiceData: Partial<Invoice>): Promise<Invoice> {
    const created = new this.invoiceModel(invoiceData);
    return created.save();
  }

  async findById(id: string): Promise<Invoice | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.invoiceModel.findById(id).exec();
  }

  async findAll(filter: { startDate?: string; endDate?: string }) {
    const query: any = {};
    if (filter.startDate || filter.endDate) {
      query.date = {};
      if (filter.startDate) query.date.$gte = new Date(filter.startDate);
      if (filter.endDate) query.date.$lte = new Date(filter.endDate);
    }
    return this.invoiceModel.find(query).exec();
  }
}
