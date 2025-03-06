import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageExpenseRepository } from 'infrastructure/persistence/AsyncStorageExpenseRepository';
import { Expense } from 'domain/entities/Expense';
import { Product } from 'domain/entities/Product';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('AsyncStorageExpenseRepository', () => {
  let repository: AsyncStorageExpenseRepository;
  const STORAGE_KEY = '@julius:expenses';

  beforeEach(() => {
    repository = new AsyncStorageExpenseRepository();
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save expense to AsyncStorage', async () => {
      const expense = new Expense(100, 'Test expense');
      expense.setCategory('Food');
      const item = new Product('Test item', 'Food', 50, 1, undefined, undefined);
      expense.addItem(item);

      await repository.save(expense);

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0]).toMatchObject({
        value: 100,
        name: 'Test expense',
        category: 'Food',
        items: [{
          type: 'product',
          name: 'Test item',
          category: 'Food',
          quantity: 1,
          unitaryValue: 50
        }]
      });
    });

    it('should append expense to existing expenses', async () => {
      const existingExpense = new Expense(50, 'Existing expense');
      const newExpense = new Expense(100, 'New expense');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([existingExpense]));

      await repository.save(newExpense);

      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toHaveLength(2);
      expect(savedData[0]).toMatchObject({
        value: 50,
        name: 'Existing expense'
      });
      expect(savedData[1]).toMatchObject({
        value: 100,
        name: 'New expense'
      });
    });
  });

  describe('getAll', () => {
    it('should return empty array when no expenses exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const expenses = await repository.getAll();
      expect(expenses).toEqual([]);
    });

    it('should return all expenses from AsyncStorage', async () => {
      const expense1 = new Expense(100, 'Test expense 1');
      const expense2 = new Expense(200, 'Test expense 2');
      const storedExpenses = [expense1, expense2];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedExpenses));

      const expenses = await repository.getAll();
      expect(expenses).toHaveLength(2);
      expect(expenses[0]).toMatchObject({
        value: 100,
        name: 'Test expense 1'
      });
      expect(expenses[1]).toMatchObject({
        value: 200,
        name: 'Test expense 2'
      });
    });
  });

  describe('getAllBetweenDates', () => {
    it('should return expenses between dates', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const expense1 = new Expense(100, 'Test expense 1');
      const expense2 = new Expense(200, 'Test expense 2');
      
      // Set timestamps within the date range
      Object.defineProperty(expense1, '_timestamp', {
        value: new Date('2024-01-15'),
        writable: false,
      });
      Object.defineProperty(expense2, '_timestamp', {
        value: new Date('2024-01-20'),
        writable: false,
      });

      const storedExpenses = [expense1, expense2];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedExpenses));

      const expenses = await repository.getAllBetweenDates(startDate, endDate);
      expect(expenses).toHaveLength(2);
      expect(expenses[0]).toMatchObject({
        value: 100,
        name: 'Test expense 1'
      });
      expect(expenses[1]).toMatchObject({
        value: 200,
        name: 'Test expense 2'
      });
    });

    it('should return empty array when no expenses exist', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const expenses = await repository.getAllBetweenDates(startDate, endDate);
      expect(expenses).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update expense in AsyncStorage', async () => {
      const oldExpense = new Expense(100, 'Old expense');
      const updatedExpense = new Expense(150, 'Updated expense');
      
      // Set same timestamp to match
      const timestamp = new Date();
      Object.defineProperty(oldExpense, '_timestamp', {
        value: timestamp,
        writable: false,
      });
      Object.defineProperty(updatedExpense, '_timestamp', {
        value: timestamp,
        writable: false,
      });

      const storedExpenses = [oldExpense];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedExpenses));

      await repository.update(updatedExpense);

      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0]).toMatchObject({
        value: 150,
        name: 'Updated expense'
      });
    });

    it('should throw error when expense not found', async () => {
      const expense = new Expense(100, 'Test expense');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

      await expect(repository.update(expense)).rejects.toThrow('Expense not found');
    });
  });

  describe('delete', () => {
    it('should delete expense from AsyncStorage', async () => {
      const expense = new Expense(100, 'Test expense');
      const storedExpenses = [expense];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedExpenses));

      await repository.delete(expense);

      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toHaveLength(0);
    });

    it('should throw error when expense not found', async () => {
      const expense = new Expense(100, 'Test expense');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

      await expect(repository.delete(expense)).rejects.toThrow('Expense not found');
    });
  });
}); 