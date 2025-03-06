type CycleName = 'daily' | 'weekly' | 'monthly' | 'yearly';

export class CycleVO {
  private readonly _name: CycleName;
  private readonly _renewalHour: number;
  private readonly _renewalDay: number;
  private readonly _renewalMonth: number | null;

  constructor(
    name: CycleName,
    renewalHour: number = 0,
    renewalDay: number = 1,
    renewalMonth: number | null = null
  ) {
    this.validateRenewalHour(renewalHour);
    this.validateRenewalDay(name, renewalDay);
    this.validateRenewalMonth(name, renewalMonth);

    this._name = name;
    this._renewalHour = renewalHour;
    this._renewalDay = renewalDay;
    this._renewalMonth = renewalMonth;
  }

  private validateRenewalHour(hour: number): void {
    if (hour < 0 || hour > 23) {
      throw new Error('Renewal hour must be between 0 and 23');
    }
  }

  private validateRenewalDay(name: CycleName, day: number): void {
    switch (name) {
      case 'weekly':
        if (day < 1 || day > 7) {
          throw new Error('Weekly renewal day must be between 1 and 7');
        }
        break;
      case 'monthly':
        if (day < 1 || day > 31) {
          throw new Error('Monthly renewal day must be between 1 and 31');
        }
        break;
      case 'yearly':
        if (day < 1 || day > 31) {
          throw new Error('Yearly renewal day must be between 1 and 31');
        }
        break;
    }
  }

  private validateRenewalMonth(name: CycleName, month: number | null): void {
    if (name === 'yearly') {
      if (month === null) {
        throw new Error('Yearly frequency requires a renewal month');
      }
      if (month < 1 || month > 12) {
        throw new Error('Yearly renewal month must be between 1 and 12');
      }
    } else if (month !== null) {
      throw new Error('Renewal month can only be set for yearly frequency');
    }
  }

  get name(): CycleName {
    return this._name;
  }

  get renewalHour(): number {
    return this._renewalHour;
  }

  get renewalDay(): number {
    return this._renewalDay;
  }

  get renewalMonth(): number | null {
    return this._renewalMonth;
  }

  toJSON() {
    return {
      name: this._name,
      renewalHour: this._renewalHour,
      renewalDay: this._renewalDay,
      renewalMonth: this._renewalMonth,
    };
  }

  static fromJSON(json: any): CycleVO {
    return new CycleVO(
      json.name,
      json.renewalHour,
      json.renewalDay,
      json.renewalMonth
    );
  }
} 