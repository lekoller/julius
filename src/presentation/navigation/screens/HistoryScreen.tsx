import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { DrawerScreenProps } from '../types';
import { AsyncStorageUserRepository } from '../../../infrastructure/persistence/AsyncStorageUserRepository';
import { Transaction } from '../types';
import { LanguageContext } from '../../../../App';
import {
  getHistoryLoading,
  getHistoryErrorUserNotFound,
  getHistoryErrorLoadFailed,
  getHistoryNoTransactions,
  getHistoryRetryButton,
} from '../../texts/getters';

export const HistoryScreen: React.FC<DrawerScreenProps<'History'>> = ({ navigation }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const { language } = React.useContext(LanguageContext);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userRepository = AsyncStorageUserRepository.getInstance();
      const user = await userRepository.get();
      if (!user) {
        setError(getHistoryErrorUserNotFound(language));
        return;
      }

      const [expenses, incomes] = await Promise.all([
        userRepository.getExpenses(),
        userRepository.getIncomes()
      ]);

      const allTransactions: Transaction[] = [
        ...expenses.map(expense => ({
          id: expense.id,
          type: 'expense' as const,
          amount: expense.value,
          description: expense.name,
          date: expense.timestamp.toISOString()
        })),
        ...incomes.map(income => ({
          id: income.id,
          type: 'income' as const,
          amount: income.value,
          description: income.name,
          date: income.timestamp.toISOString()
        }))
      ];

      // Sort by date descending
      allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(allTransactions);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError(getHistoryErrorLoadFailed(language));
    } finally {
      setIsLoading(false);
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Card style={styles.transactionCard}>
      <Card.Content>
        <Text variant="titleMedium">{item.description}</Text>
        <Text 
          variant="bodyLarge" 
          style={{ 
            color: item.type === 'expense' ? theme.colors.error : theme.colors.primary 
          }}
        >
          {item.type === 'expense' ? '-' : '+'}${item.amount.toFixed(2)}
        </Text>
        <Text variant="bodySmall" style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
          {new Date(item.date).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR')}
        </Text>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="bodyLarge">{getHistoryLoading(language)}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="bodyLarge" style={{ color: theme.colors.error }}>{error}</Text>
        <Button
          mode="contained"
          onPress={loadTransactions}
          style={styles.button}
        >
          {getHistoryRetryButton(language)}
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text variant="bodyLarge" style={styles.emptyText}>
            {getHistoryNoTransactions(language)}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    flexGrow: 1,
  },
  transactionCard: {
    marginBottom: 8,
  },
  date: {
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
  },
  button: {
    marginTop: 16,
  },
}); 