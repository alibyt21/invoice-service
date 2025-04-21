import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let service: InvoiceService;

  const mockInvoiceService = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct data', async () => {
      const dto = { customer: 'John', amount: 100 };
      const result = { _id: 'abc123', ...dto };

      mockInvoiceService.create.mockResolvedValue(result);

      const response = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should call service.findById with correct ID', async () => {
      const id = '507f1f77bcf86cd799439011';
      const invoice = { _id: id, customer: 'Jane' };

      mockInvoiceService.findById.mockResolvedValue(invoice);

      const response = await controller.findOne(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(response).toEqual(invoice);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with correct query params', async () => {
      const query = { startDate: '2023-01-01', endDate: '2023-12-31' };
      const invoices = [{ customer: 'A' }, { customer: 'B' }];

      mockInvoiceService.findAll.mockResolvedValue(invoices);

      const response = await controller.findAll(query.startDate, query.endDate);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(response).toEqual(invoices);
    });
  });
});
