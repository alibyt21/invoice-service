import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { InvoiceService } from './invoice.service';
import { Invoice } from './schemas/invoice.schema';

describe('InvoiceService', () => {
  let service: InvoiceService;

  // Sample mock invoice data
  const mockInvoice = { customer: 'John Doe', amount: 1000, date: new Date() };

  // Mock constructor simulating Mongoose document creation and saving
  const mockInvoiceConstructor = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ ...data }), // Simulates saving and returning the saved object
  }));

  // Mock Mongoose model methods
  const mockInvoiceModel = {
    findById: jest.fn(), // Simulate findById
    find: jest.fn(),     // Simulate find (with or without filters)
  };

  // Setup test module and inject dependencies
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          // Provide a mock version of the Mongoose model using getModelToken
          provide: getModelToken(Invoice.name),
          useValue: Object.assign(mockInvoiceConstructor, mockInvoiceModel),
        },
      ],
    }).compile();

    // Get the InvoiceService instance from the module
    service = module.get<InvoiceService>(InvoiceService);
  });

  // Basic existence test
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return the saved invoice', async () => {
      const result = await service.create(mockInvoice);

      // Check that the returned result matches the mock invoice
      expect(result).toEqual(mockInvoice);

      // Verify that the mock constructor was called with correct data
      expect(mockInvoiceConstructor).toHaveBeenCalledWith(mockInvoice);
    });
  });

  describe('findById', () => {
    it('should return invoice by id', async () => {
      // Mock the exec function of the query to return the mock invoice
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
