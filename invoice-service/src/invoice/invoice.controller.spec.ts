import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let service: InvoiceService;

  // Mock implementation of InvoiceService methods
  const mockInvoiceService = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    // Create a testing module with the controller and the mocked service
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
      ],
    }).compile();

    // Retrieve controller and service instances from the testing module
    controller = module.get<InvoiceController>(InvoiceController);
    service = module.get<InvoiceService>(InvoiceService);
  });

  // Basic test to check if the controller is defined
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct data', async () => {
      const dto = { customer: 'John', amount: 100 };
      const result = { _id: 'abc123', ...dto };

      // Mock the resolved value of service.create
      mockInvoiceService.create.mockResolvedValue(result);

      // Call the controller's create method
      const response = await controller.create(dto);

      // Expect service.create to have been called with dto
      expect(service.create).toHaveBeenCalledWith(dto);
      // Expect the response to match the mocked result
      expect(response).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should call service.findById with correct ID', async () => {
      const id = '507f1f77bcf86cd799439011';
      const invoice = { _id: id, customer: 'Jane' };

      // Mock the resolved value of service.findById
      mockInvoiceService.findById.mockResolvedValue(invoice);

      // Call the controller's findOne method
      const response = await controller.findOne(id);

      // Expect service.findById to have been called with the ID
      expect(service.findById).toHaveBeenCalledWith(id);
      // Expect the response to match the mocked invoice
      expect(response).toEqual(invoice);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with correct query params', async () => {
      const query = { startDate: '2023-01-01', endDate: '2023-12-31' };
      const invoices = [{ customer: 'A' }, { customer: 'B' }];

      // Mock the resolved value of service.findAll
      mockInvoiceService.findAll.mockResolvedValue(invoices);

      // Call the controller's findAll method
      const response = await controller.findAll(query.startDate, query.endDate);

      // Expect service.findAll to have been called with the query object
      expect(service.findAll).toHaveBeenCalledWith(query);
      // Expect the response to match the mocked invoices list
      expect(response).toEqual(invoices);
    });
  });
});
