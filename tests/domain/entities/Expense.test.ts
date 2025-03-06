import { Expense } from 'domain/entities/Expense';
import { Product } from 'domain/entities/Consumable';

describe('Expense', () => {
  describe('constructor', () => {
    it('should create an expense with valid parameters', () => {
      const expense = new Expense(100, 'Test expense');
      expect(expense.value).toBe(100);
      expect(expense.name).toBe('Test expense');
      expect(expense.id).toBeDefined();
      expect(expense.timestamp).toBeInstanceOf(Date);
      expect(expense.category).toBeUndefined();
      expect(expense.items).toEqual([]);
    });

    it('should create an expense with empty name', () => {
      const expense = new Expense(100);
      expect(expense.name).toBe('');
    });

    it('should throw error for invalid value', () => {
      expect(() => new Expense(0, 'Test')).toThrow('Expense value must be greater than zero');
      expect(() => new Expense(-100, 'Test')).toThrow('Expense value must be greater than zero');
    });

    it('should throw error for empty name when provided', () => {
      expect(() => new Expense(100, ' ')).toThrow('Expense name cannot be empty if provided');
      expect(() => new Expense(100, '   ')).toThrow('Expense name cannot be empty if provided');
    });
  });

  describe('category management', () => {
    let expense: Expense;

    beforeEach(() => {
      expense = new Expense(100, 'Test expense');
    });

    it('should set category correctly', () => {
      expense.setCategory('Food');
      expect(expense.category).toBe('Food');
    });

    it('should throw error for empty category', () => {
      expect(() => expense.setCategory('')).toThrow('Category cannot be empty');
      expect(() => expense.setCategory(' ')).toThrow('Category cannot be empty');
      expect(() => expense.setCategory('   ')).toThrow('Category cannot be empty');
    });
  });

  describe('items management', () => {
    let expense: Expense;
    let consumable: Product;

    beforeEach(() => {
      expense = new Expense(100, 'Test expense');
      consumable = new Product('Test item', 'Test category', 1, undefined, 50);
    });

    it('should add item correctly', () => {
      expense.addItem(consumable);
      expect(expense.items).toContain(consumable);
    });

    it('should return a copy of items array', () => {
      expense.addItem(consumable);
      const items = expense.items;
      items.push(new Product('Another item', 'Test category', 1, undefined, 30));
      expect(expense.items).toHaveLength(1);
      expect(expense.items).toContain(consumable);
    });
  });

  describe('timestamp', () => {
    it('should return a copy of the timestamp', () => {
      const expense = new Expense(100, 'Test expense');
      const timestamp = expense.timestamp;
      timestamp.setFullYear(2000);
      expect(expense.timestamp.getFullYear()).not.toBe(2000);
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const expense = new Expense(100, 'Test expense');
      expense.setCategory('Food');
      const consumable = new Product('Test item', 'Test category', 1, undefined, 50);
      expense.addItem(consumable);

      const json = expense.toJSON();
      expect(json).toEqual({
        id: expense.id,
        value: 100,
        name: 'Test expense',
        timestamp: expect.any(String),
        category: 'Food',
        items: [expect.any(Object)],
      });
    });
  });

  describe('fromJSON', () => {
    it('should create expense from JSON', () => {
      const json = {
        value: 100,
        name: 'Test expense',
        timestamp: new Date().toISOString(),
        category: 'Food',
        items: [{
          type: 'product',
          name: 'Test item',
          category: 'Test category',
          quantity: 1,
          unitaryValue: 50
        }],
      };

      const expense = Expense.fromJSON(json);
      expect(expense.value).toBe(100);
      expect(expense.name).toBe('Test expense');
      expect(expense.timestamp).toBeInstanceOf(Date);
      expect(expense.category).toBe('Food');
      expect(expense.items).toHaveLength(1);
      expect(expense.items[0]).toBeInstanceOf(Product);
      const product = expense.items[0] as Product;
      expect(product.name).toBe('Test item');
      expect(product.calculateValue()).toBe(50);
    });
  });
}); 