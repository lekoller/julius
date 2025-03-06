import { Consumable, Product, Service } from 'domain/entities/Consumable';

describe('Consumable', () => {
  describe('base class validation', () => {
    it('should throw error for empty name', () => {
      expect(() => new Product('', 'Test category')).toThrow('Name cannot be empty');
      expect(() => new Service('', 'Test category', '', 100)).toThrow('Name cannot be empty');
      expect(() => new Product(' ', 'Test category')).toThrow('Name cannot be empty');
      expect(() => new Service(' ', 'Test category', '', 100)).toThrow('Name cannot be empty');
    });

    it('should throw error for empty category', () => {
      expect(() => new Product('Test name', '')).toThrow('Category cannot be empty');
      expect(() => new Service('Test name', '', '', 100)).toThrow('Category cannot be empty');
      expect(() => new Product('Test name', ' ')).toThrow('Category cannot be empty');
      expect(() => new Service('Test name', ' ', '', 100)).toThrow('Category cannot be empty');
    });
  });
});

describe('Product', () => {
  describe('constructor', () => {
    it('should create a product with quantity', () => {
      const product = new Product('Test product', 'Test category', 2, undefined, 10);
      expect(product.name).toBe('Test product');
      expect(product.category).toBe('Test category');
      expect(product.quantity).toBe(2);
      expect(product.weight).toBeUndefined();
      expect(product.unitaryValue).toBe(10);
      expect(product.kilogramValue).toBeUndefined();
    });

    it('should create a product with weight', () => {
      const product = new Product('Test product', 'Test category', undefined, 1.5, undefined, 20);
      expect(product.name).toBe('Test product');
      expect(product.category).toBe('Test category');
      expect(product.quantity).toBeUndefined();
      expect(product.weight).toBe(1.5);
      expect(product.unitaryValue).toBeUndefined();
      expect(product.kilogramValue).toBe(20);
    });

    it('should throw error when both quantity and weight are provided', () => {
      expect(() => new Product('Test product', 'Test category', 2, 1.5, 10, 20))
        .toThrow('Product cannot have both quantity and weight');
    });

    it('should throw error for invalid quantity', () => {
      expect(() => new Product('Test product', 'Test category', 0, undefined, 10))
        .toThrow('Quantity must be greater than zero');
      expect(() => new Product('Test product', 'Test category', -1, undefined, 10))
        .toThrow('Quantity must be greater than zero');
    });

    it('should throw error for invalid weight', () => {
      expect(() => new Product('Test product', 'Test category', undefined, 0, undefined, 20))
        .toThrow('Weight must be greater than zero');
      expect(() => new Product('Test product', 'Test category', undefined, -1, undefined, 20))
        .toThrow('Weight must be greater than zero');
    });

    it('should throw error when quantity is provided without unitary value', () => {
      expect(() => new Product('Test product', 'Test category', 2))
        .toThrow('Product with quantity must have unitary value');
    });

    it('should throw error when weight is provided without kilogram value', () => {
      expect(() => new Product('Test product', 'Test category', undefined, 1.5))
        .toThrow('Product with weight must have kilogram value');
    });

    it('should throw error for invalid unitary value', () => {
      expect(() => new Product('Test product', 'Test category', 2, undefined, 0))
        .toThrow('Unitary value must be greater than zero');
      expect(() => new Product('Test product', 'Test category', 2, undefined, -10))
        .toThrow('Unitary value must be greater than zero');
    });

    it('should throw error for invalid kilogram value', () => {
      expect(() => new Product('Test product', 'Test category', undefined, 1.5, undefined, 0))
        .toThrow('Kilogram value must be greater than zero');
      expect(() => new Product('Test product', 'Test category', undefined, 1.5, undefined, -20))
        .toThrow('Kilogram value must be greater than zero');
    });
  });

  describe('value calculation', () => {
    it('should calculate value based on quantity and unitary value', () => {
      const product = new Product('Test product', 'Test category', 2, undefined, 10);
      expect(product.calculateValue()).toBe(20); // 2 * 10
    });

    it('should calculate value based on weight and kilogram value', () => {
      const product = new Product('Test product', 'Test category', undefined, 1.5, undefined, 20);
      expect(product.calculateValue()).toBe(30); // 1.5 * 20
    });

    it('should throw error when value cannot be calculated', () => {
      const product = new Product('Test product', 'Test category');
      expect(() => product.calculateValue()).toThrow('Cannot calculate value without proper measurements');
    });
  });

  describe('JSON serialization', () => {
    it('should serialize to JSON correctly', () => {
      const product = new Product('Test product', 'Test category', 2, undefined, 10);
      const json = product.toJSON();
      expect(json).toEqual({
        type: 'product',
        name: 'Test product',
        category: 'Test category',
        quantity: 2,
        weight: undefined,
        unitaryValue: 10,
        kilogramValue: undefined,
      });
    });

    it('should deserialize from JSON correctly', () => {
      const json = {
        type: 'product',
        name: 'Test product',
        category: 'Test category',
        quantity: 2,
        unitaryValue: 10,
      };
      const product = Consumable.fromJSON(json);
      expect(product).toBeInstanceOf(Product);
      const productInstance = product as Product;
      expect(productInstance.name).toBe('Test product');
      expect(productInstance.category).toBe('Test category');
      expect(productInstance.quantity).toBe(2);
      expect(productInstance.unitaryValue).toBe(10);
    });
  });
});

describe('Service', () => {
  describe('constructor', () => {
    it('should create a service with valid parameters', () => {
      const service = new Service('Test service', 'Test category', 'Test description', 100);
      expect(service.name).toBe('Test service');
      expect(service.category).toBe('Test category');
      expect(service.description).toBe('Test description');
      expect(service.value).toBe(100);
    });

    it('should create a service with empty description', () => {
      const service = new Service('Test service', 'Test category', '', 100);
      expect(service.description).toBe('');
    });

    it('should throw error for invalid value', () => {
      expect(() => new Service('Test service', 'Test category', '', 0))
        .toThrow('Service value must be greater than zero');
      expect(() => new Service('Test service', 'Test category', '', -100))
        .toThrow('Service value must be greater than zero');
    });
  });

  describe('value calculation', () => {
    it('should return the service value', () => {
      const service = new Service('Test service', 'Test category', '', 100);
      expect(service.calculateValue()).toBe(100);
    });
  });

  describe('JSON serialization', () => {
    it('should serialize to JSON correctly', () => {
      const service = new Service('Test service', 'Test category', 'Test description', 100);
      const json = service.toJSON();
      expect(json).toEqual({
        type: 'service',
        name: 'Test service',
        category: 'Test category',
        description: 'Test description',
        value: 100,
      });
    });

    it('should deserialize from JSON correctly', () => {
      const json = {
        type: 'service',
        name: 'Test service',
        category: 'Test category',
        description: 'Test description',
        value: 100,
      };
      const service = Consumable.fromJSON(json);
      expect(service).toBeInstanceOf(Service);
      const serviceInstance = service as Service;
      expect(serviceInstance.name).toBe('Test service');
      expect(serviceInstance.category).toBe('Test category');
      expect(serviceInstance.description).toBe('Test description');
      expect(serviceInstance.value).toBe(100);
    });
  });
}); 