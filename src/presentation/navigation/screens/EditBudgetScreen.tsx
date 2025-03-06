import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button, Card, TextInput, useTheme } from 'react-native-paper';
import { DrawerScreenProps } from '../types';
import { AsyncStorageUserRepository } from '../../../infrastructure/persistence/AsyncStorageUserRepository';
import { User } from '../../../domain/entities/User';
import { Budget } from '../../../domain/entities/Budget';
import { EventEmitter } from '../../../infrastructure/services/EventEmitterService';
import { LanguageContext } from '../../../../App';
import {
  getEditBudgetTitle,
  getEditBudgetDescription,
  getEditBudgetDailyAmountLabel,
  getEditBudgetRenewalHourLabel,
  getCommonEnterAmountPlaceholder,
  getCommonEnterHourPlaceholder,
} from '../../texts/getters';

export const EditBudgetScreen: React.FC<DrawerScreenProps<'EditBudget'>> = ({ navigation }) => {
  const [dailyValue, setDailyValue] = useState('');
  const [renewalHour, setRenewalHour] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHourPicker, setShowHourPicker] = useState(false);
  const theme = useTheme();
  const { language } = React.useContext(LanguageContext);

  useEffect(() => {
    loadCurrentBudget();
  }, []);

  const loadCurrentBudget = async () => {
    try {
      const userRepository = AsyncStorageUserRepository.getInstance();
      const user = await userRepository.get();
      if (!user) {
        setError('User not found');
        return;
      }

      setDailyValue(user.budget.dailyValue.toString());
      setRenewalHour(user.budget.dailyRenewalHour.toString());
    } catch (err) {
      console.error('Error loading current budget:', err);
      setError('Failed to load current budget configuration');
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const newDailyValue = parseFloat(dailyValue);
      const newRenewalHour = parseInt(renewalHour, 10);

      if (isNaN(newDailyValue) || newDailyValue <= 0) {
        setError('Please enter a valid daily budget amount');
        return;
      }

      if (isNaN(newRenewalHour) || newRenewalHour < 0 || newRenewalHour > 23) {
        setError('Please enter a valid hour (0-23)');
        return;
      }

      const userRepository = AsyncStorageUserRepository.getInstance();
      const user = await userRepository.get();
      if (!user) {
        setError('User not found');
        return;
      }

      // Create new budget with updated values but keep current cycle and balance
      const newBudget = new Budget(
        newDailyValue,
        newRenewalHour,
        user.budget.cycle,
        user.budget.balance
      );

      // Create new user with updated budget
      const updatedUser = new User(
        user.mensalIncome,
        user.fixedExpense,
        user.mensalMandatorySavings,
        newBudget
      );

      await userRepository.update(updatedUser);
      EventEmitter.emit('budget:updated', newBudget);
      navigation.goBack();
    } catch (err) {
      console.error('Error saving budget configuration:', err);
      setError('Failed to save budget configuration');
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
              {getEditBudgetTitle(language)}
            </Text>
            <Text variant="bodyLarge" style={styles.description}>
              {getEditBudgetDescription(language)}
            </Text>

            <View style={styles.form}>
              <TextInput
                label={getEditBudgetDailyAmountLabel(language)}
                placeholder={getCommonEnterAmountPlaceholder(language)}
                keyboardType="numeric"
                value={dailyValue}
                onChangeText={(text) => {
                  setDailyValue(text);
                  setError(null);
                }}
                style={styles.input}
                mode="outlined"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />

              <TouchableOpacity
                onPress={() => setShowHourPicker(true)}
                style={styles.inputContainer}
                activeOpacity={0.7}
              >
                <View pointerEvents="none">
                  <TextInput
                    label={getEditBudgetRenewalHourLabel(language)}
                    value={renewalHour}
                    style={styles.input}
                    mode="outlined"
                    right={<TextInput.Icon icon="chevron-down" />}
                    editable={false}
                    showSoftInputOnFocus={false}
                  />
                </View>
              </TouchableOpacity>

              <Modal
                visible={showHourPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowHourPicker(false)}
              >
                <TouchableWithoutFeedback onPress={() => setShowHourPicker(false)}>
                  <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                      <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                        <Text variant="titleLarge" style={styles.modalTitle}>
                          {getEditBudgetRenewalHourLabel(language)}
                        </Text>
                        <ScrollView style={styles.modalScroll}>
                          {Array.from({ length: 24 }, (_, i) => (
                            <TouchableOpacity
                              key={i}
                              style={styles.modalItem}
                              onPress={() => {
                                setRenewalHour(i.toString());
                                setShowHourPicker(false);
                              }}
                            >
                              <Text style={styles.modalItemText}>{i.toString()}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>

              {error && (
                <Text variant="bodyMedium" style={[styles.error, { color: theme.colors.error }]}>
                  {error}
                </Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSave}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
              >
                Save
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                disabled={isLoading}
                style={styles.button}
              >
                Cancel
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
    marginBottom: 16,
  },
  description: {
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
  inputContainer: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalItemText: {
    fontSize: 16,
  },
}); 