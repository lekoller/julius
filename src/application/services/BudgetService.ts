import { IUserRepository } from '../interfaces/IUserRepository';

export class BudgetService {
  private renewalTimeout: number | null = null;

  constructor(private readonly userRepository: IUserRepository) {}

  async startDailyRenewal(): Promise<void> {
    const user = await this.userRepository.get();
    if (!user) {
      throw new Error('User not found');
    }

    this.scheduleNextRenewal();
  }

  private async scheduleNextRenewal(): Promise<void> {
    const user = await this.userRepository.get();
    if (!user) {
      throw new Error('User not found');
    }

    const now = new Date();
    const nextRenewal = this.calculateNextRenewalTime(now, user.budget.dailyRenewalHour);
    const timeUntilRenewal = nextRenewal.getTime() - now.getTime();

    if (this.renewalTimeout) {
      clearTimeout(this.renewalTimeout);
    }

    this.renewalTimeout = setTimeout(async () => {
      await this.performRenewal();
      this.scheduleNextRenewal(); // Schedule next renewal
    }, timeUntilRenewal);
  }

  private async performRenewal(): Promise<void> {
    const user = await this.userRepository.get();
    
    if (!user) {
      throw new Error('User not found');
    }

    user.budget.updateBalance(user.budget.dailyValue);

    await this.userRepository.update(user);
  }

  private calculateNextRenewalTime(now: Date, renewalHour: number): Date {
    const nextRenewal = new Date(now);
    nextRenewal.setHours(renewalHour, 0, 0, 0);

    // If the renewal hour has passed today, schedule for tomorrow
    if (now.getHours() >= renewalHour) {
      nextRenewal.setDate(nextRenewal.getDate() + 1);
    }

    return nextRenewal;
  }

  stopDailyRenewal(): void {
    if (this.renewalTimeout) {
      clearTimeout(this.renewalTimeout);
      this.renewalTimeout = null;
    }
  }
} 