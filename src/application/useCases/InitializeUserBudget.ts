import { User } from '../../domain/entities/User';
import { Budget } from '../../domain/entities/Budget';
import { CycleVO } from '../../domain/value-objects/CycleVO';
import { IUserRepository } from '../interfaces/IUserRepository';

interface InitializeUserBudgetParams {
  dailyBudget: number;
  renewalHour: number;
  renewalDay?: number;
  renewalMonth?: number | null;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  income?: number | null;
  fixedExpenses?: number | null;
  targetSavings?: number | null;
}

export class InitializeUserBudget {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(params: InitializeUserBudgetParams): Promise<void> {
    const {
      dailyBudget,
      renewalHour,
      renewalDay,
      renewalMonth,
      frequency,
      income = null,
      fixedExpenses = null,
      targetSavings = null,
    } = params;

    let cycle: CycleVO | null = null;
    if (frequency) {
      cycle = new CycleVO(
        frequency,
        renewalHour,
        renewalDay,
        frequency === 'yearly' ? renewalMonth : null
      );
    }

    const budget = new Budget(
      dailyBudget,
      renewalHour,
      cycle,
      dailyBudget // "we start at day 1, not day 0"
    );

    const user = new User(
      income,
      fixedExpenses,
      targetSavings,
      budget
    );

    await this.userRepository.save(user);
  }
} 