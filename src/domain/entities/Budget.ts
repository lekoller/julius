import { CycleVO } from '../value-objects/CycleVO';

export class Budget {
  private readonly _dailyValue: number;
  private readonly _dailyRenewalHour: number;
  private _balance: number;
  private _opd: number | null;
  private _cycle: CycleVO | null;

  constructor(
    dailyValue: number,
    dailyRenewalHour: number,
    cycle: CycleVO | null = null,
    balance: number = 0
  ) {
    this.validateDailyRenewalHour(dailyRenewalHour);
    this._dailyValue = dailyValue;
    this._dailyRenewalHour = dailyRenewalHour;
    this._balance = balance;
    this._opd = null;
    this._cycle = cycle;
    
    this.recalculateOpd();
  }

  private validateDailyRenewalHour(hour: number): void {
    if (hour < 0 || hour > 23) {
      throw new Error('Daily renewal hour must be between 0 and 23');
    }
  }

  get dailyValue(): number {
    return this._dailyValue;
  }

  get dailyRenewalHour(): number {
    return this._dailyRenewalHour;
  }

  get cycle(): CycleVO | null {
    return this._cycle;
  }

  get balance(): number {
    return this._balance;
  }

  get opd(): number | null {
    return this._opd;
  }

  updateBalance(value: number): void {
    this._balance += value;
    this.recalculateOpd();
  }

  private recalculateOpd(): void {
    if (!this._cycle) {
      this._opd = null;
      return;
    }

    const now = new Date();
    const nextCycleRenewal = this.getNextCycleRenewalDate();
    const daysUntilRenewal = Math.ceil((nextCycleRenewal.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    this._opd = (this._balance + ((daysUntilRenewal - 1) * this._dailyValue)) / daysUntilRenewal;
  }

  private getNextCycleRenewalDate(): Date {
    if (!this._cycle) {
      return new Date(); // Return current date if no cycle
    }

    const now = new Date();
    const result = new Date(now);
    result.setHours(this._cycle.renewalHour, 0, 0, 0);

    // If we've passed today's renewal hour, move to next cycle
    if (now.getHours() >= this._cycle.renewalHour) {
      switch (this._cycle.name) {
        case 'daily':
          result.setDate(result.getDate() + 1);
          break;
        case 'weekly':
          while (result.getDay() + 1 !== this._cycle.renewalDay) {
            result.setDate(result.getDate() + 1);
          }
          break;
        case 'monthly':
          result.setDate(this._cycle.renewalDay);
          if (result <= now) {
            result.setMonth(result.getMonth() + 1);
          }
          break;
        case 'yearly':
          result.setMonth(this._cycle.renewalMonth!);
          result.setDate(this._cycle.renewalDay);
          if (result <= now) {
            result.setFullYear(result.getFullYear() + 1);
          }
          break;
      }
    }

    return result;
  }

  setCycle(cycle: CycleVO): void {
    this._cycle = cycle;
    this.recalculateOpd();
  }

  toJSON() {
    return {
      dailyValue: this._dailyValue,
      dailyRenewalHour: this._dailyRenewalHour,
      cycle: this._cycle ? {
        name: this._cycle.name,
        renewalHour: this._cycle.renewalHour,
        renewalDay: this._cycle.renewalDay,
        renewalMonth: this._cycle.renewalMonth,
      } : null,
      balance: this._balance,
      opd: this._opd,
    };
  }
} 