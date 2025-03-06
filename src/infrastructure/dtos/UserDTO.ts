import { CycleVO } from '../../domain/value-objects/CycleVO';
import { ExpenseDTO } from './ExpenseDTO';
import { IncomeDTO } from './IncomeDTO';

export interface UserDTO {
  mensalIncome: number | null;
  fixedExpense: number | null;
  mensalMandatorySavings: number | null;
  budget: {
    dailyValue: number;
    dailyRenewalHour: number;
    cycle: {
      name: CycleVO['name'];
      renewalHour: number;
      renewalDay?: number;
      renewalMonth: number | null;
    } | null;
    balance: number;
  };
  expenses: ExpenseDTO[];
  incomes: IncomeDTO[];
} 