import { ExpenseService } from 'application/services/ExpenseService';
import { IExpenseRepository } from 'application/interfaces/IExpenseRepository';
import { IUserRepository } from 'application/interfaces/IUserRepository';
import { Expense } from 'domain/entities/Expense';
import { User } from 'domain/entities/User';
import { Budget } from 'domain/entities/Budget';
import { Product } from 'domain/entities/Consumable';

describe('ExpenseService', () => {
  let expenseService: ExpenseService;
  let mockExpenseRepository: jest.Mocked<IExpenseRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockExpenseRepository = {
      save: jest.fn(),
      getAll: jest.fn(),
      getAllBetweenDates: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockUserRepository = {
      save: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      exists: jest.fn(),
      getExpenses: jest.fn(),
      getIncomes: jest.fn(),
      addExpense: jest.fn(),
      addIncome: jest.fn(),
    };

    expenseService = new ExpenseService(mockExpenseRepository, mockUserRepository);
  });

  describe('addExpense', () => {
    it('should add expense successfully', async () => {
      const mockUser = new User(5000, 1000, 500, new Budget(100, 8));
      mockUserRepository.get.mockResolvedValue(mockUser);

      const value = 100;
      const name = 'Test expense';
      const category = 'Food';
      const items = [new Product('Test item', 'Food', 1, undefined, 50)];

      await expenseService.addExpense(value, name, category, items);

      expect(mockUserRepository.get).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(expect.any(User));
      expect(mockExpenseRepository.save).toHaveBeenCalledWith(expect.any(Expense));
      
      const savedExpense = (mockExpenseRepository.save as jest.Mock).mock.calls[0][0];
      expect(savedExpense.value).toBe(value);
      expect(savedExpense.name).toBe(name);
      expect(savedExpense.category).toBe(category);
      expect(savedExpense.items).toEqual(items);
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.get.mockResolvedValue(null);

      await expect(expenseService.addExpense(100, 'Test expense', 'Food'))
        .rejects.toThrow('User not found');
    });
  });

  describe('updateExpense', () => {
    it('should update expense successfully', async () => {
      const mockUser = new User(5000, 1000, 500, new Budget(100, 8));
      mockUserRepository.get.mockResolvedValue(mockUser);

      const oldExpense = new Expense(100, 'Old expense');
      const newValue = 150;
      const newName = 'Updated expense';
      const newCategory = 'Food';
      const newItems = [new Product('New item', 'Food', 1, undefined, 50)];

      await expenseService.updateExpense(oldExpense, newValue, newName, newCategory, newItems);

      expect(mockUserRepository.get).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(expect.any(User));
      expect(mockExpenseRepository.update).toHaveBeenCalledWith(expect.any(Expense));
      
      const updatedExpense = (mockExpenseRepository.update as jest.Mock).mock.calls[0][0];
      expect(updatedExpense.value).toBe(newValue);
      expect(updatedExpense.name).toBe(newName);
      expect(updatedExpense.category).toBe(newCategory);
      expect(updatedExpense.items).toEqual(newItems);
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.get.mockResolvedValue(null);

      await expect(expenseService.updateExpense(
        new Expense(100, 'Test expense'),
        150,
        'Updated expense',
        'Food'
      )).rejects.toThrow('User not found');
    });
  });

  describe('deleteExpense', () => {
    it('should delete expense successfully', async () => {
      const mockUser = new User(5000, 1000, 500, new Budget(100, 8));
      mockUserRepository.get.mockResolvedValue(mockUser);

      const expense = new Expense(100, 'Test expense');

      await expenseService.deleteExpense(expense);

      expect(mockUserRepository.get).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(expect.any(User));
      expect(mockExpenseRepository.delete).toHaveBeenCalledWith(expense);
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.get.mockResolvedValue(null);

      await expect(expenseService.deleteExpense(new Expense(100, 'Test expense')))
        .rejects.toThrow('User not found');
    });
  });
}); 