import { Income } from 'domain/entities/Income';

describe('Income', () => {
  describe('constructor', () => {
    it('should create an income with valid parameters', () => {
      const income = new Income(100, 'Test income');
      expect(income.value).toBe(100);
      expect(income.name).toBe('Test income');
      expect(income.id).toBeDefined();
      expect(income.timestamp).toBeInstanceOf(Date);
    });

    it('should create an income with empty name', () => {
      const income = new Income(100);
      expect(income.name).toBe('');
    });

    it('should throw error for invalid value', () => {
      expect(() => new Income(0, 'Test')).toThrow('Income value must be greater than zero');
      expect(() => new Income(-100, 'Test')).toThrow('Income value must be greater than zero');
    });

    it('should throw error for empty name when provided', () => {
      expect(() => new Income(100, ' ')).toThrow('Income name cannot be empty if provided');
      expect(() => new Income(100, '   ')).toThrow('Income name cannot be empty if provided');
    });
  });

  describe('timestamp', () => {
    it('should return a copy of the timestamp', () => {
      const income = new Income(100, 'Test income');
      const timestamp = income.timestamp;
      timestamp.setFullYear(2000);
      expect(income.timestamp.getFullYear()).not.toBe(2000);
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const income = new Income(100, 'Test income');
      const json = income.toJSON();
      expect(json).toEqual({
        id: income.id,
        value: 100,
        name: 'Test income',
        timestamp: expect.any(String),
      });
    });
  });

  describe('fromJSON', () => {
    it('should create income from JSON', () => {
      const json = {
        value: 100,
        name: 'Test income',
        timestamp: new Date().toISOString(),
      };

      const income = Income.fromJSON(json);
      expect(income.value).toBe(100);
      expect(income.name).toBe('Test income');
      expect(income.timestamp).toBeInstanceOf(Date);
    });
  });
}); 