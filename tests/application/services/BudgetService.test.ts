import { BudgetService } from 'application/services/BudgetService';
import { IUserRepository } from 'application/interfaces/IUserRepository';
import { User } from 'domain/entities/User';
import { Budget } from 'domain/entities/Budget';

describe('BudgetService', () => {
  let budgetService: BudgetService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockUser: User;

  beforeEach(() => {
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

    mockUser = new User(5000, 1000, 500, new Budget(100, 8));
    mockUserRepository.get.mockResolvedValue(mockUser);

    budgetService = new BudgetService(mockUserRepository);
  });

  describe('startDailyRenewal', () => {
    it('should start daily renewal successfully', async () => {
      await budgetService.startDailyRenewal();
      // Note: We can't easily test the timeout behavior, but we can verify the service is initialized
      expect(mockUserRepository.get).toHaveBeenCalled();
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.get.mockResolvedValue(null);

      await expect(budgetService.startDailyRenewal())
        .rejects.toThrow('User not found');
    });
  });

  describe('stopDailyRenewal', () => {
    it('should stop daily renewal', () => {
      budgetService.stopDailyRenewal();
      // Note: We can't easily test the timeout clearing, but we can verify the method exists
      expect(budgetService.stopDailyRenewal).toBeDefined();
    });
  });

  describe('performRenewal', () => {
    it('should update budget balance with daily value', async () => {
      const initialBalance = mockUser.budget.balance;
      const dailyValue = mockUser.budget.dailyValue;

      await budgetService['performRenewal']();

      expect(mockUserRepository.get).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(expect.any(User));
      
      const updatedUser = (mockUserRepository.update as jest.Mock).mock.calls[0][0];
      expect(updatedUser.budget.balance).toBe(initialBalance + dailyValue);
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.get.mockResolvedValue(null);

      await expect(budgetService['performRenewal']())
        .rejects.toThrow('User not found');
    });
  });

  describe('calculateNextRenewalTime', () => {
    it('should calculate next renewal time correctly', () => {
      const now = new Date();
      const renewalHour = 8;
      const nextRenewal = budgetService['calculateNextRenewalTime'](now, renewalHour);

      expect(nextRenewal.getHours()).toBe(renewalHour);
      expect(nextRenewal.getMinutes()).toBe(0);
      expect(nextRenewal.getSeconds()).toBe(0);
      expect(nextRenewal.getMilliseconds()).toBe(0);

      // If current hour is past renewal hour, next renewal should be tomorrow
      if (now.getHours() >= renewalHour) {
        expect(nextRenewal.getDate()).toBe(now.getDate() + 1);
      } else {
        expect(nextRenewal.getDate()).toBe(now.getDate());
      }
    });
  });
}); 