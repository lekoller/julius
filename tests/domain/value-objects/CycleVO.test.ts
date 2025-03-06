import { CycleVO } from 'domain/value-objects/CycleVO';

describe('CycleVO', () => {
  describe('constructor', () => {
    it('should create a daily cycle with default values', () => {
      const cycle = new CycleVO('daily');
      expect(cycle.name).toBe('daily');
      expect(cycle.renewalHour).toBe(0);
      expect(cycle.renewalDay).toBe(1);
      expect(cycle.renewalMonth).toBeNull();
    });

    it('should create a cycle with custom values', () => {
      const cycle = new CycleVO('weekly', 8, 2);
      expect(cycle.name).toBe('weekly');
      expect(cycle.renewalHour).toBe(8);
      expect(cycle.renewalDay).toBe(2);
      expect(cycle.renewalMonth).toBeNull();
    });

    it('should create a yearly cycle with month', () => {
      const cycle = new CycleVO('yearly', 8, 1, 1);
      expect(cycle.name).toBe('yearly');
      expect(cycle.renewalHour).toBe(8);
      expect(cycle.renewalDay).toBe(1);
      expect(cycle.renewalMonth).toBe(1);
    });
  });

  describe('validation', () => {
    it('should throw error for invalid renewal hour', () => {
      expect(() => new CycleVO('daily', -1)).toThrow('Renewal hour must be between 0 and 23');
      expect(() => new CycleVO('daily', 24)).toThrow('Renewal hour must be between 0 and 23');
    });

    it('should throw error for invalid weekly renewal day', () => {
      expect(() => new CycleVO('weekly', 0, 0)).toThrow('Weekly renewal day must be between 1 and 7');
      expect(() => new CycleVO('weekly', 0, 8)).toThrow('Weekly renewal day must be between 1 and 7');
    });

    it('should throw error for invalid monthly renewal day', () => {
      expect(() => new CycleVO('monthly', 0, 0)).toThrow('Monthly renewal day must be between 1 and 31');
      expect(() => new CycleVO('monthly', 0, 32)).toThrow('Monthly renewal day must be between 1 and 31');
    });

    it('should throw error for invalid yearly renewal day', () => {
      expect(() => new CycleVO('yearly', 0, 0, 1)).toThrow('Yearly renewal day must be between 1 and 31');
      expect(() => new CycleVO('yearly', 0, 32, 1)).toThrow('Yearly renewal day must be between 1 and 31');
    });

    it('should throw error for invalid yearly renewal month', () => {
      expect(() => new CycleVO('yearly', 0, 1, 0)).toThrow('Yearly renewal month must be between 1 and 12');
      expect(() => new CycleVO('yearly', 0, 1, 13)).toThrow('Yearly renewal month must be between 1 and 12');
      expect(() => new CycleVO('yearly', 0, 1, null)).toThrow('Yearly frequency requires a renewal month');
    });

    it('should throw error when renewal month is set for non-yearly cycles', () => {
      expect(() => new CycleVO('daily', 0, 1, 1)).toThrow('Renewal month can only be set for yearly frequency');
      expect(() => new CycleVO('weekly', 0, 1, 1)).toThrow('Renewal month can only be set for yearly frequency');
      expect(() => new CycleVO('monthly', 0, 1, 1)).toThrow('Renewal month can only be set for yearly frequency');
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const cycle = new CycleVO('yearly', 8, 1, 1);
      const json = cycle.toJSON();
      expect(json).toEqual({
        name: 'yearly',
        renewalHour: 8,
        renewalDay: 1,
        renewalMonth: 1,
      });
    });
  });

  describe('fromJSON', () => {
    it('should create cycle from JSON', () => {
      const json = {
        name: 'yearly',
        renewalHour: 8,
        renewalDay: 1,
        renewalMonth: 1,
      };
      const cycle = CycleVO.fromJSON(json);
      expect(cycle.name).toBe('yearly');
      expect(cycle.renewalHour).toBe(8);
      expect(cycle.renewalDay).toBe(1);
      expect(cycle.renewalMonth).toBe(1);
    });
  });
}); 