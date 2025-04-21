import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { InvoiceService } from './invoice.service';
import { Invoice } from './schemas/invoice.schema';

describe('InvoiceService', () => {
  let service: InvoiceService;

  const mockInvoice = { customer: 'John Doe', amount: 1000, date: new Date() };

  // Mock constructor for Invoice model
  const mockInvoiceConstructor = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ ...data }),
  }));

  const mockInvoiceModel = {
    findById: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken(Invoice.name),
          useValue: Object.assign(mockInvoiceConstructor, mockInvoiceModel),
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return the saved invoice', async () => {
      const result = await service.create(mockInvoice);
      expect(result).toEqual(mockInvoice);
      expect(mockInvoiceConstructor).toHaveBeenCalledWith(mockInvoice);
    });
  });

  describe('findById', () => {
    it('should return invoice by id', async () => {
      const execMock = jest.fn().mockResolvedValue(mockInvoice);
      mockInvoiceModel.findById.mockReturnValue({ exec: execMock });

      const result = await service.findById('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('findAll', () => {
    it('should return all invoices', async () => {
      const execMock = jest.fn().mockResolvedValue([mockInvoice]);
      mockInvoiceModel.find.mockReturnValue({ exec: execMock });

      const result = await service.findAll({});
      expect(result).toEqual([mockInvoice]);
    });

    it('should return invoices filtered by date', async () => {
      const execMock = jest.fn().mockResolvedValue([mockInvoice]);
      mockInvoiceModel.find.mockReturnValue({ exec: execMock });

      const result = await service.findAll({ startDate: '2023-01-01', endDate: '2023-12-31' });
      expect(result).toEqual([mockInvoice]);
    });
  });
});
