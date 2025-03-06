import AsyncStorage from '@react-native-async-storage/async-storage';
import { IIncomeRepository } from '../../application/interfaces/IIncomeRepository';
import { Income } from '../../domain/entities/Income';
import { IncomeDTO } from '../dtos/IncomeDTO';

const INCOMES_STORAGE_KEY = '@julius:incomes';

export class AsyncStorageIncomeRepository implements IIncomeRepository {
  async save(income: Income): Promise<void> {
    const incomes = await this.getAll();
    incomes.push(income);
    
    const incomeDTOs = incomes.map(i => this.toDTO(i));
    await AsyncStorage.setItem(INCOMES_STORAGE_KEY, JSON.stringify(incomeDTOs));
  }

  async getAll(): Promise<Income[]> {
    const incomesJson = await AsyncStorage.getItem(INCOMES_STORAGE_KEY);
    if (!incomesJson) return [];

    const incomeDTOs: IncomeDTO[] = JSON.parse(incomesJson);
    return incomeDTOs.map(dto => this.fromDTO(dto));
  }

  async getAllBetweenDates(startDate: Date, endDate: Date): Promise<Income[]> {
    const incomes = await this.getAll();
    return incomes.filter(income => {
      const incomeDate = income.timestamp;
      return incomeDate >= startDate && incomeDate <= endDate;
    });
  }

  async delete(income: Income): Promise<void> {
    const incomes = await this.getAll();
    const index = incomes.findIndex(
      i => i.timestamp.getTime() === income.timestamp.getTime()
    );
    
    if (index === -1) {
      throw new Error('Income not found');
    }

    incomes.splice(index, 1);
    await AsyncStorage.setItem(
      INCOMES_STORAGE_KEY,
      JSON.stringify(incomes.map(i => this.toDTO(i)))
    );
  }

  async update(income: Income): Promise<void> {
    const incomes = await this.getAll();
    const index = incomes.findIndex(
      i => i.timestamp.getTime() === income.timestamp.getTime()
    );
    
    if (index === -1) {
      throw new Error('Income not found');
    }

    incomes[index] = income;
    await AsyncStorage.setItem(
      INCOMES_STORAGE_KEY,
      JSON.stringify(incomes.map(i => this.toDTO(i)))
    );
  }

  private toDTO(income: Income): IncomeDTO {
    return {
      id: income.id,
      value: income.value,
      name: income.name,
      timestamp: income.timestamp.toISOString(),
    };
  }

  private fromDTO(dto: IncomeDTO): Income {
    const income = new Income(dto.value, dto.name);
    Object.defineProperty(income, '_timestamp', {
      value: new Date(dto.timestamp),
      writable: false,
    });
    return income;
  }
} 