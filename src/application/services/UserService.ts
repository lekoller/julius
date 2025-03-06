import { User } from '../../domain/entities/User';
import { Budget } from '../../domain/entities/Budget';
import { CycleVO } from '../../domain/value-objects/CycleVO';
import { IUserRepository } from '../interfaces/IUserRepository';

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async initializeUser(
    mensalIncome: number | null,
    fixedExpense: number | null,
    mensalMandatorySavings: number | null,
    dailyBudget: number,
    dailyRenewalHour: number,
    cycle: CycleVO,
    initialBalance: number = 0
  ): Promise<User> {
    const budget = new Budget(dailyBudget, dailyRenewalHour, cycle, initialBalance);
    const user = new User(mensalIncome, fixedExpense, mensalMandatorySavings, budget);
    
    await this.userRepository.save(user);
    return user;
  }

  async getUser(): Promise<User | null> {
    return await this.userRepository.get();
  }

  async updateUser(user: User): Promise<void> {
    await this.userRepository.update(user);
  }

  async userExists(): Promise<boolean> {
    return await this.userRepository.exists();
  }

  calculateRecommendedDailyBudget(
    mensalIncome: number | null,
    fixedExpense: number | null,
    mensalMandatorySavings: number | null,
    cycleType: CycleVO['name']
  ): number | null {
    if (mensalIncome === null || fixedExpense === null || mensalMandatorySavings === null) {
      return null;
    }

    const availableAmount = mensalIncome - fixedExpense - mensalMandatorySavings;
    let daysInPeriod: number;

    switch (cycleType) {
      case 'daily':
        daysInPeriod = 1;
        break;
      case 'weekly':
        daysInPeriod = 7;
        break;
      case 'monthly':
        daysInPeriod = 30;
        break;
      case 'yearly':
        daysInPeriod = 365;
        break;
    }

    const dailyAmount = availableAmount / daysInPeriod;
    // Round down to nearest multiple of 5
    return Math.floor(dailyAmount / 5) * 5;
  }
} 