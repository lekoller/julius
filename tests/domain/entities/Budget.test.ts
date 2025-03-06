import { Budget } from 'domain/entities/Budget';
import { CycleVO } from 'domain/value-objects/CycleVO';

describe('Budget', () => {
  describe('constructor', () => {
    it('should create a budget with valid parameters', () => {
      const budget = new Budget(100, 8);
      expect(budget.dailyValue).toBe(100);
      expect(budget.dailyRenewalHour).toBe(8);
      expect(budget.balance).toBe(0);
      expect(budget.cycle).toBeNull();
      expect(budget.opd).toBeNull();
    });

    it('should throw error when daily renewal hour is invalid', () => {
      expect(() => new Budget(100, -1)).toThrow('Daily renewal hour must be between 0 and 23');
      expect(() => new Budget(100, 24)).toThrow('Daily renewal hour must be between 0 and 23');
    });

    it('should create a budget with initial balance', () => {
      const budget = new Budget(100, 8, null, 500);
      expect(budget.balance).toBe(500);
    });
  });

  describe('balance management', () => {
    let budget: Budget;

    beforeEach(() => {
      budget = new Budget(100, 8);
    });

    it('should update balance correctly', () => {
      budget.updateBalance(200);
      expect(budget.balance).toBe(200);
      
      budget.updateBalance(-50);
      expect(budget.balance).toBe(150);
    });
  });

  describe('cycle management', () => {
    let budget: Budget;

    beforeEach(() => {
      budget = new Budget(100, 8);
    });

    it('should set and get cycle', () => {
      const cycle = new CycleVO('daily', 8);
      budget.setCycle(cycle);
      expect(budget.cycle).toEqual(cycle);
    });

    it('should recalculate OPD when cycle is set', () => {
      const cycle = new CycleVO('daily', 8);
      budget.setCycle(cycle);
      expect(budget.opd).not.toBeNull();
    });
  });

  describe('OPD calculation', () => {
    let budget: Budget;
    let cycle: CycleVO;

    beforeEach(() => {
      budget = new Budget(100, 8);
      cycle = new CycleVO('daily', 8);
      budget.setCycle(cycle);
    });

    it('should calculate OPD correctly for daily cycle', () => {
      const now = new Date();
      const nextRenewal = new Date(now);
      nextRenewal.setHours(8, 0, 0, 0);
      if (now.getHours() >= 8) {
        nextRenewal.setDate(nextRenewal.getDate() + 1);
      }
      
      const daysUntilRenewal = Math.ceil((nextRenewal.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const expectedOpd = (budget.balance + ((daysUntilRenewal - 1) * budget.dailyValue)) / daysUntilRenewal;
      
      expect(budget.opd).toBeCloseTo(expectedOpd, 2);
    });

    it('should handle weekly cycle renewal', () => {
      const weeklyCycle = new CycleVO('weekly', 8, 1); // Monday
      budget.setCycle(weeklyCycle);
      expect(budget.opd).not.toBeNull();
    });

    it('should handle monthly cycle renewal', () => {
      const monthlyCycle = new CycleVO('monthly', 8, 1); // 1st of the month
      budget.setCycle(monthlyCycle);
      expect(budget.opd).not.toBeNull();
    });

    it('should handle yearly cycle renewal', () => {
      const yearlyCycle = new CycleVO('yearly', 8, 1, 1); // January 1st
      budget.setCycle(yearlyCycle);
      expect(budget.opd).not.toBeNull();
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const budget = new Budget(100, 8);
      const cycle = new CycleVO('daily', 8);
      budget.setCycle(cycle);
      
      const json = budget.toJSON();
      expect(json).toEqual({
        dailyValue: 100,
        dailyRenewalHour: 8,
        cycle: {
          name: 'daily',
          renewalHour: 8,
          renewalDay: 1,
          renewalMonth: null,
        },
        balance: 0,
        opd: expect.any(Number),
      });
    });

    it('should handle null cycle in JSON representation', () => {
      const budget = new Budget(100, 8);
      const json = budget.toJSON();
      expect(json.cycle).toBeNull();
    });
  });
}); 