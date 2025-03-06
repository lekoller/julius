import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageIncomeRepository } from 'infrastructure/persistence/AsyncStorageIncomeRepository';
import { Income } from 'domain/entities/Income';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('AsyncStorageIncomeRepository', () => {
  let repository: AsyncStorageIncomeRepository;
  const STORAGE_KEY = '@julius:incomes';

  beforeEach(() => {
    repository = new AsyncStorageIncomeRepository();
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save income to AsyncStorage', async () => {
      const income = new Income(100, 'Test income');

      await repository.save(income);

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0]).toMatchObject({
        value: 100,
        name: 'Test income'
      });
    });

    it('should append income to existing incomes', async () => {
      const existingIncome = new Income(50, 'Existing income');
      const newIncome = new Income(100, 'New income');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([existingIncome]));

      await repository.save(newIncome);

      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toHaveLength(2);
      expect(savedData[0]).toMatchObject({
        value: 50,
        name: 'Existing income'
      });
      expect(savedData[1]).toMatchObject({
        value: 100,
        name: 'New income'
      });
    });
  });

  describe('getAll', () => {
    it('should return empty array when no incomes exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const incomes = await repository.getAll();
      expect(incomes).toEqual([]);
    });

    it('should return all incomes from AsyncStorage', async () => {
      const income1 = new Income(100, 'Test income 1');
      const income2 = new Income(200, 'Test income 2');
      const storedIncomes = [income1, income2];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedIncomes));

      const incomes = await repository.getAll();
      expect(incomes).toHaveLength(2);
      expect(incomes[0]).toMatchObject({
        value: 100,
        name: 'Test income 1'
      });
      expect(incomes[1]).toMatchObject({
        value: 200,
        name: 'Test income 2'
      });
    });
  });

  describe('getAllBetweenDates', () => {
    it('should return incomes between dates', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const income1 = new Income(100, 'Test income 1');
      const income2 = new Income(200, 'Test income 2');
      
      // Set timestamps within the date range
      Object.defineProperty(income1, '_timestamp', {
        value: new Date('2024-01-15'),
        writable: false,
      });
      Object.defineProperty(income2, '_timestamp', {
        value: new Date('2024-01-20'),
        writable: false,
      });

      const storedIncomes = [income1, income2];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedIncomes));

      const incomes = await repository.getAllBetweenDates(startDate, endDate);
      expect(incomes).toHaveLength(2);
      expect(incomes[0]).toMatchObject({
        value: 100,
        name: 'Test income 1'
      });
      expect(incomes[1]).toMatchObject({
        value: 200,
        name: 'Test income 2'
      });
    });

    it('should return empty array when no incomes exist', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const incomes = await repository.getAllBetweenDates(startDate, endDate);
      expect(incomes).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update income in AsyncStorage', async () => {
      const oldIncome = new Income(100, 'Old income');
      const updatedIncome = new Income(150, 'Updated income');
      
      // Set same timestamp to match
      const timestamp = new Date();
      Object.defineProperty(oldIncome, '_timestamp', {
        value: timestamp,
        writable: false,
      });
      Object.defineProperty(updatedIncome, '_timestamp', {
        value: timestamp,
        writable: false,
      });

      const storedIncomes = [oldIncome];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedIncomes));

      await repository.update(updatedIncome);

      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0]).toMatchObject({
        value: 150,
        name: 'Updated income'
      });
    });

    it('should throw error when income not found', async () => {
      const income = new Income(100, 'Test income');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

      await expect(repository.update(income)).rejects.toThrow('Income not found');
    });
  });

  describe('delete', () => {
    it('should delete income from AsyncStorage', async () => {
      const income = new Income(100, 'Test income');
      const storedIncomes = [income];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedIncomes));

      await repository.delete(income);

      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toHaveLength(0);
    });

    it('should throw error when income not found', async () => {
      const income = new Income(100, 'Test income');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

      await expect(repository.delete(income)).rejects.toThrow('Income not found');
    });
  });
}); 