import { InitializeUserBudget } from 'application/useCases/InitializeUserBudget';
import { IUserRepository } from 'application/interfaces/IUserRepository';
import { User } from 'domain/entities/User';
import { Budget } from 'domain/entities/Budget';
import { CycleVO } from 'domain/value-objects/CycleVO';

describe('InitializeUserBudget', () => {
  let initializeUserBudget: InitializeUserBudget;
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

    initializeUserBudget = new InitializeUserBudget(mockUserRepository);
  });

  describe('execute', () => {
    it('should initialize user with daily cycle', async () => {
      const params = {
        dailyBudget: 100,
        renewalHour: 8,
        frequency: 'daily' as const,
        income: 5000,
        fixedExpenses: 1000,
        targetSavings: 500,
      };

      await initializeUserBudget.execute(params);

      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
      const savedUser = (mockUserRepository.save as jest.Mock).mock.calls[0][0];
      
      expect(savedUser.mensalIncome).toBe(params.income);
      expect(savedUser.fixedExpense).toBe(params.fixedExpenses);
      expect(savedUser.mensalMandatorySavings).toBe(params.targetSavings);
      expect(savedUser.budget.dailyValue).toBe(params.dailyBudget);
      expect(savedUser.budget.dailyRenewalHour).toBe(params.renewalHour);
      expect(savedUser.budget.cycle).toEqual(new CycleVO('daily', params.renewalHour));
      expect(savedUser.budget.balance).toBe(params.dailyBudget); // Initial balance equals daily budget
    });

    it('should initialize user with weekly cycle', async () => {
      const params = {
        dailyBudget: 100,
        renewalHour: 8,
        renewalDay: 1,
        frequency: 'weekly' as const,
        income: 5000,
        fixedExpenses: 1000,
        targetSavings: 500,
      };

      await initializeUserBudget.execute(params);

      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
      const savedUser = (mockUserRepository.save as jest.Mock).mock.calls[0][0];
      
      expect(savedUser.budget.cycle).toEqual(new CycleVO('weekly', params.renewalHour, params.renewalDay));
    });

    it('should initialize user with monthly cycle', async () => {
      const params = {
        dailyBudget: 100,
        renewalHour: 8,
        renewalDay: 1,
        frequency: 'monthly' as const,
        income: 5000,
        fixedExpenses: 1000,
        targetSavings: 500,
      };

      await initializeUserBudget.execute(params);

      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
      const savedUser = (mockUserRepository.save as jest.Mock).mock.calls[0][0];
      
      expect(savedUser.budget.cycle).toEqual(new CycleVO('monthly', params.renewalHour, params.renewalDay));
    });

    it('should initialize user with yearly cycle', async () => {
      const params = {
        dailyBudget: 100,
        renewalHour: 8,
        renewalDay: 1,
        renewalMonth: 1,
        frequency: 'yearly' as const,
        income: 5000,
        fixedExpenses: 1000,
        targetSavings: 500,
      };

      await initializeUserBudget.execute(params);

      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
      const savedUser = (mockUserRepository.save as jest.Mock).mock.calls[0][0];
      
      expect(savedUser.budget.cycle).toEqual(new CycleVO('yearly', params.renewalHour, params.renewalDay, params.renewalMonth));
    });

    it('should initialize user without cycle', async () => {
      const params = {
        dailyBudget: 100,
        renewalHour: 8,
        income: 5000,
        fixedExpenses: 1000,
        targetSavings: 500,
      };

      await initializeUserBudget.execute(params);

      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
      const savedUser = (mockUserRepository.save as jest.Mock).mock.calls[0][0];
      
      expect(savedUser.budget.cycle).toBeNull();
    });

    it('should initialize user with null optional parameters', async () => {
      const params = {
        dailyBudget: 100,
        renewalHour: 8,
        frequency: 'daily' as const,
      };

      await initializeUserBudget.execute(params);

      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
      const savedUser = (mockUserRepository.save as jest.Mock).mock.calls[0][0];
      
      expect(savedUser.mensalIncome).toBeNull();
      expect(savedUser.fixedExpense).toBeNull();
      expect(savedUser.mensalMandatorySavings).toBeNull();
    });
  });
}); 