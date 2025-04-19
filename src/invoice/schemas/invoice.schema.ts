import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema()
export class InvoiceItem {
  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  qt: number;
}

const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ required: true })
  customer: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  reference: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: [InvoiceItemSchema], required: true })
  items: InvoiceItem[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
