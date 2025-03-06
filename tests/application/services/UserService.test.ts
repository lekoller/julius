import { UserService } from 'application/services/UserService';
import { IUserRepository } from 'application/interfaces/IUserRepository';
import { User } from 'domain/entities/User';
import { Budget } from 'domain/entities/Budget';
import { CycleVO } from 'domain/value-objects/CycleVO';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

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

    userService = new UserService(mockUserRepository);
  });

  describe('initializeUser', () => {
    it('should initialize user with valid parameters', async () => {
      const params = {
        mensalIncome: 5000,
        fixedExpense: 1000,
        mensalMandatorySavings: 500,
        dailyBudget: 100,
        dailyRenewalHour: 8,
        cycle: new CycleVO('daily', 8),
        initialBalance: 1000,
      };

      await userService.initializeUser(
        params.mensalIncome,
        params.fixedExpense,
        params.mensalMandatorySavings,
        params.dailyBudget,
        params.dailyRenewalHour,
        params.cycle,
        params.initialBalance
      );

      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
      const savedUser = (mockUserRepository.save as jest.Mock).mock.calls[0][0];
      expect(savedUser.mensalIncome).toBe(params.mensalIncome);
      expect(savedUser.fixedExpense).toBe(params.fixedExpense);
      expect(savedUser.mensalMandatorySavings).toBe(params.mensalMandatorySavings);
      expect(savedUser.budget.dailyValue).toBe(params.dailyBudget);
      expect(savedUser.budget.dailyRenewalHour).toBe(params.dailyRenewalHour);
      expect(savedUser.budget.cycle).toEqual(params.cycle);
      expect(savedUser.budget.balance).toBe(params.initialBalance);
    });

    it('should throw error when total expenses exceed monthly income', async () => {
      const params = {
        mensalIncome: 1000,
        fixedExpense: 800,
        mensalMandatorySavings: 300,
        dailyBudget: 100,
        dailyRenewalHour: 8,
        cycle: new CycleVO('daily', 8),
      };

      await expect(userService.initializeUser(
        params.mensalIncome,
        params.fixedExpense,
        params.mensalMandatorySavings,
        params.dailyBudget,
        params.dailyRenewalHour,
        params.cycle
      )).rejects.toThrow('Total expenses and savings cannot exceed monthly income');
    });
  });

  describe('getUser', () => {
    it('should return user when exists', async () => {
      const mockUser = new User(5000, 1000, 500, new Budget(100, 8));
      mockUserRepository.get.mockResolvedValue(mockUser);

      const user = await userService.getUser();
      expect(user).toEqual(mockUser);
    });

    it('should return null when user does not exist', async () => {
      mockUserRepository.get.mockResolvedValue(null);

      const user = await userService.getUser();
      expect(user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const mockUser = new User(5000, 1000, 500, new Budget(100, 8));
      await userService.updateUser(mockUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('userExists', () => {
    it('should return true when user exists', async () => {
      mockUserRepository.exists.mockResolvedValue(true);
      const exists = await userService.userExists();
      expect(exists).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      mockUserRepository.exists.mockResolvedValue(false);
      const exists = await userService.userExists();
      expect(exists).toBe(false);
    });
  });

  describe('calculateRecommendedDailyBudget', () => {
    it('should calculate daily budget correctly for daily cycle', () => {
      const budget = userService.calculateRecommendedDailyBudget(5000, 1000, 500, 'daily');
      expect(budget).toBe(3500); // (5000 - 1000 - 500) / 1
    });

    it('should calculate daily budget correctly for weekly cycle', () => {
      const budget = userService.calculateRecommendedDailyBudget(5000, 1000, 500, 'weekly');
      expect(budget).toBe(500); // (5000 - 1000 - 500) / 7
    });

    it('should calculate daily budget correctly for monthly cycle', () => {
      const budget = userService.calculateRecommendedDailyBudget(5000, 1000, 500, 'monthly');
      // (5000 - 1000 - 500) / 30 = 116.67, rounded down to nearest 5 = 115
      expect(budget).toBe(115);
    });

    it('should calculate daily budget correctly for yearly cycle', () => {
      const budget = userService.calculateRecommendedDailyBudget(5000, 1000, 500, 'yearly');
      // (5000 - 1000 - 500) / 365 = 9.59, rounded down to nearest 5 = 5
      expect(budget).toBe(5);
    });

    it('should return null when any parameter is null', () => {
      expect(userService.calculateRecommendedDailyBudget(null, 1000, 500, 'daily')).toBeNull();
      expect(userService.calculateRecommendedDailyBudget(5000, null, 500, 'daily')).toBeNull();
      expect(userService.calculateRecommendedDailyBudget(5000, 1000, null, 'daily')).toBeNull();
    });
  });
}); 