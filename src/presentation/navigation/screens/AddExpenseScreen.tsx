import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, Button, Card, TextInput, useTheme } from 'react-native-paper';
import { RootStackScreenProps } from '../types';
import { AsyncStorageUserRepository } from '../../../infrastructure/persistence/AsyncStorageUserRepository';
import { Expense } from '../../../domain/entities/Expense';
import { LanguageContext } from '../../../../App';
import {
  getAddExpenseTitle,
  getAddExpenseAmountLabel,
  getAddExpenseDescriptionLabel,
  getAddExpenseButton,
  getAddExpenseCancelButton,
  getAddExpenseErrorInvalidAmount,
  getAddExpenseErrorUserNotFound,
  getAddExpenseErrorFailed,
  getAddExpenseDefaultDescription,
  getCommonEnterAmountPlaceholder,
} from '../../texts/getters';

export const AddExpenseScreen: React.FC<RootStackScreenProps<'AddExpense'>> = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { language } = React.useContext(LanguageContext);

  const handleAddExpense = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        setError(getAddExpenseErrorInvalidAmount(language));
        return;
      }

      const userRepository = AsyncStorageUserRepository.getInstance();
      const user = await userRepository.get();
      if (!user) {
        setError(getAddExpenseErrorUserNotFound(language));
        return;
      }

      const expense = new Expense(amountValue, name || getAddExpenseDefaultDescription(language));
      user.addExpense(expense);
      await userRepository.save(user);
      await userRepository.addExpense(expense);

      navigation.goBack();
    } catch (err) {
      console.error('Error adding expense:', err);
      setError(getAddExpenseErrorFailed(language));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.contentCard}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              {getAddExpenseTitle(language)}
            </Text>
            
            <View style={styles.form}>
              <TextInput
                label={getAddExpenseAmountLabel(language)}
                placeholder={getCommonEnterAmountPlaceholder(language)}
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  setError(null);
                }}
                style={styles.input}
                mode="outlined"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              
              <TextInput
                label={getAddExpenseDescriptionLabel(language)}
                placeholder={getCommonEnterAmountPlaceholder(language)}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError(null);
                }}
                style={styles.input}
                mode="outlined"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />

              {error && (
                <Text variant="bodyMedium" style={[styles.error, { color: theme.colors.error }]}>
                  {error}
                </Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleAddExpense}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
              >
                {getAddExpenseButton(language)}
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                disabled={isLoading}
                style={styles.button}
              >
                {getAddExpenseCancelButton(language)}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentCard: {
    marginTop: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  input: {
    width: '100%',
  },
  error: {
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
}); 