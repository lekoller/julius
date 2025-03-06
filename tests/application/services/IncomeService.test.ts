import { IncomeService } from 'application/services/IncomeService';
import { IIncomeRepository } from 'application/interfaces/IIncomeRepository';
import { IUserRepository } from 'application/interfaces/IUserRepository';
import { Income } from 'domain/entities/Income';
import { User } from 'domain/entities/User';
import { Budget } from 'domain/entities/Budget';
import { Expense } from 'domain/entities/Expense';

describe('IncomeService', () => {
  let incomeService: IncomeService;
  let mockIncomeRepository: jest.Mocked<IIncomeRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockIncomeRepository = {
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

    incomeService = new IncomeService(mockIncomeRepository, mockUserRepository);
  });

  describe('addIncome', () => {
    it('should add income successfully', async () => {
      const mockUser = new User(5000, 1000, 500, new Budget(100, 8));
      mockUserRepository.get.mockResolvedValue(mockUser);

      const value = 200;
      const name = 'Test income';

      await incomeService.addIncome(value, name);

      expect(mockUserRepository.get).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(expect.any(User));
      expect(mockIncomeRepository.save).toHaveBeenCalledWith(expect.any(Income));
      
      const savedIncome = (mockIncomeRepository.save as jest.Mock).mock.calls[0][0];
      expect(savedIncome.value).toBe(value);
      expect(savedIncome.name).toBe(name);
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.get.mockResolvedValue(null);

      await expect(incomeService.addIncome(200, 'Test income'))
        .rejects.toThrow('User not found');
    });
  });

  describe('getAllIncomes', () => {
    it('should return all incomes', async () => {
      const mockIncomes = [
        new Income(200, 'Income 1'),
        new Income(300, 'Income 2'),
      ];
      mockIncomeRepository.getAll.mockResolvedValue(mockIncomes);

      const incomes = await incomeService.getAllIncomes();
      expect(incomes).toEqual(mockIncomes);
    });
  });

  describe('getIncomesBetweenDates', () => {
    it('should return incomes between dates', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const mockIncomes = [
        new Income(200, 'Income 1'),
        new Income(300, 'Income 2'),
      ];
      mockIncomeRepository.getAllBetweenDates.mockResolvedValue(mockIncomes);

      const incomes = await incomeService.getIncomesBetweenDates(startDate, endDate);
      expect(incomes).toEqual(mockIncomes);
    });
  });

  describe('updateIncome', () => {
    it('should update income successfully', async () => {
      const mockUser = new User(5000, 1000, 500, new Budget(100, 8));
      mockUserRepository.get.mockResolvedValue(mockUser);

      const oldIncome = new Income(200, 'Old income');
      const newValue = 300;
      const newName = 'Updated income';

      await incomeService.updateIncome(oldIncome, newValue, newName);

      expect(mockUserRepository.get).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(expect.any(User));
      expect(mockIncomeRepository.update).toHaveBeenCalledWith(expect.any(Income));
      
      const updatedIncome = (mockIncomeRepository.update as jest.Mock).mock.calls[0][0];
      expect(updatedIncome.value).toBe(newValue);
      expect(updatedIncome.name).toBe(newName);
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.get.mockResolvedValue(null);

      await expect(incomeService.updateIncome(
        new Income(200, 'Test income'),
        300,
        'Updated income'
      )).rejects.toThrow('User not found');
    });
  });

  describe('deleteIncome', () => {
    it('should delete income successfully', async () => {
      const mockUser = new User(5000, 1000, 500, new Budget(100, 8));
      mockUserRepository.get.mockResolvedValue(mockUser);

      const income = new Income(200, 'Test income');

      await incomeService.deleteIncome(income);

      expect(mockUserRepository.get).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(expect.any(User));
      expect(mockIncomeRepository.delete).toHaveBeenCalledWith(income);
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.get.mockResolvedValue(null);

      await expect(incomeService.deleteIncome(new Income(200, 'Test income')))
        .rejects.toThrow('User not found');
    });
  });
}); 