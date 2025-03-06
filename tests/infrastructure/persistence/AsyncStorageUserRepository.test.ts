import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageUserRepository } from 'infrastructure/persistence/AsyncStorageUserRepository';
import { User } from 'domain/entities/User';
import { Budget } from 'domain/entities/Budget';
import { CycleVO } from 'domain/value-objects/CycleVO';
import { Expense } from 'domain/entities/Expense';
import { Income } from 'domain/entities/Income';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('AsyncStorageUserRepository', () => {
  let repository: AsyncStorageUserRepository;
  const STORAGE_KEY = '@julius:user';

  beforeEach(() => {
    repository = AsyncStorageUserRepository.getInstance();
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save user to AsyncStorage', async () => {
      const user = new User(5000, 1000, 500, new Budget(100, 8));
      const expectedData = {
        mensalIncome: user.mensalIncome,
        fixedExpense: user.fixedExpense,
        mensalMandatorySavings: user.mensalMandatorySavings,
        budget: {
          dailyValue: user.budget.dailyValue,
          dailyRenewalHour: user.budget.dailyRenewalHour,
          balance: user.budget.balance,
          cycle: null,
        },
        expenses: [],
        incomes: []
      };

      await repository.save(user);

      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toMatchObject(expectedData);
    });

    it('should save user with cycle to AsyncStorage', async () => {
      const cycle = new CycleVO('daily', 8);
      const user = new User(5000, 1000, 500, new Budget(100, 8, cycle));
      const expectedData = {
        mensalIncome: user.mensalIncome,
        fixedExpense: user.fixedExpense,
        mensalMandatorySavings: user.mensalMandatorySavings,
        budget: {
          dailyValue: user.budget.dailyValue,
          dailyRenewalHour: user.budget.dailyRenewalHour,
          balance: user.budget.balance,
          cycle: {
            name: cycle.name,
            renewalHour: cycle.renewalHour,
            renewalDay: cycle.renewalDay,
            renewalMonth: cycle.renewalMonth,
          },
        },
        expenses: [],
        incomes: []
      };

      await repository.save(user);

      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toMatchObject(expectedData);
    });
  });

  describe('get', () => {
    it('should return null when no user exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (repository as any).user = null;

      const user = await repository.get();
      expect(user).toBeNull();
    });

    it('should return user from AsyncStorage', async () => {
      const cycle = new CycleVO('daily', 8);
      const originalUser = new User(5000, 1000, 500, new Budget(100, 8, cycle));
      const storedData = {
        mensalIncome: originalUser.mensalIncome,
        fixedExpense: originalUser.fixedExpense,
        mensalMandatorySavings: originalUser.mensalMandatorySavings,
        budget: {
          dailyValue: originalUser.budget.dailyValue,
          dailyRenewalHour: originalUser.budget.dailyRenewalHour,
          balance: originalUser.budget.balance,
          cycle: {
            name: cycle.name,
            renewalHour: cycle.renewalHour,
            renewalDay: cycle.renewalDay,
            renewalMonth: cycle.renewalMonth,
          },
        },
        expenses: [],
        incomes: []
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedData));
      
      // Mock the expense repository's getCurrentDayExpenses method
      const mockExpenseRepository = {
        getCurrentDayExpenses: jest.fn().mockResolvedValue([])
      };
      (repository as any).expenseRepository = mockExpenseRepository;

      const user = await repository.get();
      expect(user).toBeInstanceOf(User);
      expect(user?.mensalIncome).toBe(originalUser.mensalIncome);
      expect(user?.fixedExpense).toBe(originalUser.fixedExpense);
      expect(user?.mensalMandatorySavings).toBe(originalUser.mensalMandatorySavings);
      expect(user?.budget.dailyValue).toBe(originalUser.budget.dailyValue);
      expect(user?.budget.dailyRenewalHour).toBe(originalUser.budget.dailyRenewalHour);
      expect(user?.budget.balance).toBe(originalUser.budget.balance);
      expect(user?.budget.cycle).toEqual(originalUser.budget.cycle);
      expect(user?.expenses).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update user in AsyncStorage', async () => {
      const user = new User(5000, 1000, 500, new Budget(100, 8));
      const expectedData = {
        mensalIncome: user.mensalIncome,
        fixedExpense: user.fixedExpense,
        mensalMandatorySavings: user.mensalMandatorySavings,
        budget: {
          dailyValue: user.budget.dailyValue,
          dailyRenewalHour: user.budget.dailyRenewalHour,
          balance: user.budget.balance,
          cycle: null,
        },
        expenses: [],
        incomes: []
      };

      await repository.update(user);

      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toMatchObject(expectedData);
    });
  });

  describe('exists', () => {
    it('should return true when user exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{}');

      const exists = await repository.exists();
      expect(exists).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const exists = await repository.exists();
      expect(exists).toBe(false);
    });
  });

  describe('getExpenses', () => {
    it('should return empty array when no expenses exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

      const expenses = await repository.getExpenses();
      expect(expenses).toEqual([]);
    });

    it('should return expenses from user', async () => {
      const expense1 = new Expense(100, 'Test expense 1');
      const expense2 = new Expense(200, 'Test expense 2');
      const storedExpenses = [expense1, expense2];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedExpenses));

      const expenses = await repository.getExpenses();
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

  describe('getIncomes', () => {
    it('should return empty array when no incomes exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

      const incomes = await repository.getIncomes();
      expect(incomes).toEqual([]);
    });

    it('should return incomes from user', async () => {
      const income1 = new Income(100, 'Test income 1');
      const income2 = new Income(200, 'Test income 2');
      const storedIncomes = [income1, income2];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedIncomes));

      const incomes = await repository.getIncomes();
      expect(incomes).toHaveLength(2);
      expect(incomes[0]).toMatchObject({
        value: 100,
        name: 'Test income 1'
      });
      expect(incomes[1]).toMatchObject({
        value: 200,
        name: 'Test income 2'
      });
    });
  });

  describe('addExpense', () => {
    it('should add expense to user', async () => {
      const expense = new Expense(100, 'Test expense');
      expense.setCategory('Food');

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));

      await repository.addExpense(expense);

      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0]).toMatchObject({
        value: 100,
        name: 'Test expense',
        category: 'Food'
      });
    });
  });

  describe('addIncome', () => {
    it('should add income to user', async () => {
      const income = new Income(200, 'Test income');

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));

      await repository.addIncome(income);

      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0]).toMatchObject({
        value: 200,
        name: 'Test income'
      });
    });
  });
}); 