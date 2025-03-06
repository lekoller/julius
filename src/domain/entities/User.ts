import { Budget } from './Budget';
import { Expense } from './Expense';
import { Income } from './Income';
import { EventEmitter } from '../../infrastructure/services/EventEmitterService';

export class User {
  private _expenses: Expense[] = [];
  private _incomes: Income[] = [];

  constructor(
    private readonly _mensalIncome: number | null = null,
    private readonly _fixedExpense: number | null = null,
    private readonly _mensalMandatorySavings: number | null = null,
    private readonly _budget: Budget,
  ) {
    if (_mensalIncome !== null) {
      this.validateMensalIncome(_mensalIncome);
    }
    if (_fixedExpense !== null) {
      this.validateFixedExpense(_fixedExpense);
    }
    if (_mensalMandatorySavings !== null) {
      this.validateMensalMandatorySavings(_mensalMandatorySavings);
    }
    if (_mensalIncome !== null && _fixedExpense !== null && _mensalMandatorySavings !== null) {
      this.validateTotalExpenses();
    }
  }

  get mensalIncome(): number | null {
    return this._mensalIncome;
  }

  get fixedExpense(): number | null {
    return this._fixedExpense;
  }

  get mensalMandatorySavings(): number | null {
    return this._mensalMandatorySavings;
  }

  get budget(): Budget {
    return this._budget;
  }

  get expenses(): Expense[] {
    return [...this._expenses];
  }

  get incomes(): Income[] {
    return [...this._incomes];
  }

  set expenses(expenses: Expense[]) {
    this._expenses = expenses;
  }

  set incomes(incomes: Income[]) {
    this._incomes = incomes;
  }

  addExpense(expense: Expense): void {
    this._expenses.push(expense);
    this._budget.updateBalance(-expense.value);
    EventEmitter.emit('budget:updated', this._budget);
  }

  addIncome(income: Income): void {
    this._incomes.push(income);
    this._budget.updateBalance(income.value);
    EventEmitter.emit('budget:updated', this._budget);
  }

  private validateMensalIncome(income: number): void {
    if (income <= 0) {
      throw new Error('Monthly income must be greater than zero');
    }
  }

  private validateFixedExpense(expense: number): void {
    if (expense < 0) {
      throw new Error('Fixed expense cannot be negative');
    }
  }

  private validateMensalMandatorySavings(savings: number): void {
    if (savings < 0) {
      throw new Error('Monthly mandatory savings cannot be negative');
    }
  }

  private validateTotalExpenses(): void {
    if (this._mensalIncome === null || this._fixedExpense === null || this._mensalMandatorySavings === null) {
      return;
    }
    const totalExpenses = this._fixedExpense + this._mensalMandatorySavings;
    if (totalExpenses >= this._mensalIncome) {
      throw new Error('Total expenses and savings cannot exceed monthly income');
    }
  }

  static calculateRecommendedDailyBudget(
    mensalIncome: number | null,
    fixedExpense: number | null,
    mensalMandatorySavings: number | null
  ): number | null {
    if (mensalIncome === null || fixedExpense === null || mensalMandatorySavings === null) {
      return null;
    }
    const availableMonthlyAmount = mensalIncome - fixedExpense - mensalMandatorySavings;
    const dailyAmount = availableMonthlyAmount / 30; // Using 30 days as a standard month
    return Math.floor(dailyAmount / 5) * 5;
  }
} 