import { User } from 'domain/entities/User';
import { Budget } from 'domain/entities/Budget';
import { Expense } from 'domain/entities/Expense';
import { Income } from 'domain/entities/Income';

describe('User', () => {
  let budget: Budget;
  
  beforeEach(() => {
    budget = new Budget(1000, 8, null, 1000);
  });

  describe('constructor', () => {
    it('should create a user with valid parameters', () => {
      const user = new User(5000, 1000, 500, budget);
      expect(user.mensalIncome).toBe(5000);
      expect(user.fixedExpense).toBe(1000);
      expect(user.mensalMandatorySavings).toBe(500);
      expect(user.budget).toBe(budget);
    });

    it('should throw error when monthly income is zero or negative', () => {
      expect(() => new User(0, 1000, 500, budget)).toThrow('Monthly income must be greater than zero');
      expect(() => new User(-1000, 1000, 500, budget)).toThrow('Monthly income must be greater than zero');
    });

    it('should throw error when fixed expense is negative', () => {
      expect(() => new User(5000, -1000, 500, budget)).toThrow('Fixed expense cannot be negative');
    });

    it('should throw error when mandatory savings is negative', () => {
      expect(() => new User(5000, 1000, -500, budget)).toThrow('Monthly mandatory savings cannot be negative');
    });

    it('should throw error when total expenses exceed monthly income', () => {
      expect(() => new User(1000, 800, 300, budget)).toThrow('Total expenses and savings cannot exceed monthly income');
    });
  });

  describe('expenses and incomes management', () => {
    let user: User;

    beforeEach(() => {
      user = new User(5000, 1000, 500, budget);
    });

    it('should add expense and update budget', () => {
      const expense = new Expense(100, 'Test expense');
      user.addExpense(expense);
      expect(user.expenses).toContain(expense);
      expect(user.budget.balance).toBe(900); // 1000 - 100
    });

    it('should add income and update budget', () => {
      const income = new Income(200, 'Test income');
      user.addIncome(income);
      expect(user.incomes).toContain(income);
      expect(user.budget.balance).toBe(1200); // 1000 + 200
    });

    it('should set expenses and incomes', () => {
      const expenses = [new Expense(100, 'Test expense')];
      const incomes = [new Income(200, 'Test income')];
      
      user.expenses = expenses;
      user.incomes = incomes;
      
      expect(user.expenses).toEqual(expenses);
      expect(user.incomes).toEqual(incomes);
    });
  });

  describe('calculateRecommendedDailyBudget', () => {
    it('should calculate recommended daily budget correctly', () => {
      const dailyBudget = User.calculateRecommendedDailyBudget(5000, 1000, 500);
      // (5000 - 1000 - 500) / 30 = 116.67, rounded down to nearest 5 = 115
      expect(dailyBudget).toBe(115);
    });

    it('should return null when any parameter is null', () => {
      expect(User.calculateRecommendedDailyBudget(null, 1000, 500)).toBeNull();
      expect(User.calculateRecommendedDailyBudget(5000, null, 500)).toBeNull();
      expect(User.calculateRecommendedDailyBudget(5000, 1000, null)).toBeNull();
    });
  });
}); 