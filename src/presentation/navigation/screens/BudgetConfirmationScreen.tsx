import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button, Card, TextInput, useTheme } from 'react-native-paper';
import { RootStackScreenProps } from '../types';
import { InitializeUserBudget } from '../../../application/useCases/InitializeUserBudget';
import { AsyncStorageUserRepository } from '../../../infrastructure/persistence/AsyncStorageUserRepository';
import { WEEK_DAYS } from '../../../domain/constants/time';
import { LanguageContext } from '../../../../App';
import {
  getBudgetConfirmationTitle,
  getBudgetConfirmationDescription,
  getBudgetConfirmationDailyBudgetLabel,
  getBudgetConfirmationRenewalHourLabel,
  getBudgetConfirmationDayOfWeekLabel,
  getBudgetConfirmationDayOfMonthLabel,
  getBudgetConfirmationDayOfYearLabel,
  getBudgetConfirmationMonthLabel,
  getCommonEnterAmountPlaceholder,
  getCommonEnterHourPlaceholder,
  getCommonEnterDayPlaceholder,
  getSetBudgetSelectDayOfWeek,
  getSetBudgetDayOfWeekLabel,
  getSetBudgetContinueButton,
  getSetBudgetBackButton,
} from '../../texts/getters';

export const BudgetConfirmationScreen: React.FC<RootStackScreenProps<'BudgetConfirmation'>> = ({ route, navigation }) => {
  const { dailyBudget, frequency, income, fixedExpenses, targetSavings } = route.params;
  const [adjustedBudget, setAdjustedBudget] = useState(dailyBudget.toString());
  const [renewalHour, setRenewalHour] = useState('0');
  const [renewalDay, setRenewalDay] = useState('1');
  const [renewalMonth, setRenewalMonth] = useState('1');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHourPicker, setShowHourPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const theme = useTheme();
  const { language } = React.useContext(LanguageContext);

  const getDayLabel = () => {
    if (frequency === 'monthly') return getBudgetConfirmationDayOfMonthLabel(language);
    if (frequency === 'yearly') return getBudgetConfirmationDayOfYearLabel(language);
    return '';
  };

  const validateInputs = () => {
    const budget = parseFloat(adjustedBudget);
    const hour = parseInt(renewalHour, 10);
    const day = parseInt(renewalDay, 10);
    const month = parseInt(renewalMonth, 10);

    if (isNaN(budget) || budget <= 0 || budget > dailyBudget) {
      setError('Budget must be greater than 0 and not exceed the recommended amount');
      return false;
    }

    if (isNaN(hour) || hour < 0 || hour > 23) {
      setError('Please enter a valid hour (0-23)');
      return false;
    }

    if (frequency === 'weekly' && (isNaN(day) || day < 1 || day > 7)) {
      setError('Please select a valid day of the week');
      return false;
    }

    if (frequency === 'monthly' && (isNaN(day) || day < 1 || day > 31)) {
      setError('Please enter a valid day of month (1-31)');
      return false;
    }

    if (frequency === 'yearly') {
      if (isNaN(day) || day < 1 || day > 31) {
        setError('Please enter a valid day (1-31)');
        return false;
      }
      if (isNaN(month) || month < 1 || month > 12) {
        setError('Please enter a valid month (1-12)');
        return false;
      }
    }

    return true;
  };

  const handleConfirm = async () => {
    if (!validateInputs()) return;

    try {
      setIsLoading(true);
      setError(null);

      const userRepository = AsyncStorageUserRepository.getInstance();
      const initializeUserBudget = new InitializeUserBudget(userRepository);

      await initializeUserBudget.execute({
        dailyBudget: parseFloat(adjustedBudget),
        renewalHour: parseInt(renewalHour, 10),
        renewalDay: parseInt(renewalDay, 10),
        renewalMonth: parseInt(renewalMonth, 10),
        frequency,
        income,
        fixedExpenses,
        targetSavings,
      });

      navigation.navigate('Main', { screen: 'Main' });
    } catch (err) {
      setError('Failed to save budget configuration. Please try again.');
      console.error('Error saving budget:', err);
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
              {getBudgetConfirmationTitle(language)}
            </Text>
            <Text variant="bodyLarge" style={styles.description}>
              {getBudgetConfirmationDescription(language).replace('%s', dailyBudget.toString())}
            </Text>
            
            <View style={styles.form}>
              <TextInput
                label={getBudgetConfirmationDailyBudgetLabel(language)}
                placeholder={getCommonEnterAmountPlaceholder(language)}
                keyboardType="numeric"
                value={adjustedBudget}
                onChangeText={(text) => {
                  setAdjustedBudget(text);
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
                    label={getBudgetConfirmationRenewalHourLabel(language)}
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
                          {getBudgetConfirmationRenewalHourLabel(language)}
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

              {frequency !== 'daily' && (
                frequency === 'weekly' ? (
                  <TouchableOpacity
                    onPress={() => setShowDayPicker(true)}
                    style={styles.inputContainer}
                    activeOpacity={0.7}
                  >
                    <View pointerEvents="none">
                      <TextInput
                        label={getSetBudgetDayOfWeekLabel(language)}
                        value={renewalDay ? WEEK_DAYS.find(day => day.value.toString() === renewalDay)?.label || '' : getSetBudgetSelectDayOfWeek(language)}
                        style={styles.input}
                        mode="outlined"
                        right={<TextInput.Icon icon="chevron-down" />}
                        editable={false}
                        showSoftInputOnFocus={false}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TextInput
                    label={getDayLabel()}
                    placeholder={getCommonEnterDayPlaceholder(language)}
                    keyboardType="numeric"
                    value={renewalDay}
                    onChangeText={(text) => {
                      setRenewalDay(text);
                      setError(null);
                    }}
                    style={styles.input}
                    mode="outlined"
                  />
                )
              )}

              <Modal
                visible={showDayPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowDayPicker(false)}
              >
                <TouchableWithoutFeedback onPress={() => setShowDayPicker(false)}>
                  <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                      <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                        <Text variant="titleLarge" style={styles.modalTitle}>
                          {getSetBudgetDayOfWeekLabel(language)}
                        </Text>
                        <ScrollView style={styles.modalScroll}>
                          {WEEK_DAYS.map((day) => (
                            <TouchableOpacity
                              key={day.value}
                              style={styles.modalItem}
                              onPress={() => {
                                setRenewalDay(day.value.toString());
                                setShowDayPicker(false);
                                setError(null);
                              }}
                            >
                              <Text style={styles.modalItemText}>{day.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>

              {frequency === 'yearly' && (
                <TextInput
                  label={getBudgetConfirmationMonthLabel(language)}
                  placeholder={getCommonEnterDayPlaceholder(language)}
                  keyboardType="numeric"
                  value={renewalMonth}
                  onChangeText={(text) => {
                    setRenewalMonth(text);
                    setError(null);
                  }}
                  style={styles.input}
                  mode="outlined"
                />
              )}

              {error && (
                <Text variant="bodyMedium" style={[styles.error, { color: theme.colors.error }]}>
                  {error}
                </Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleConfirm}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
              >
                {getSetBudgetContinueButton(language)}
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                disabled={isLoading}
                style={styles.button}
              >
                {getSetBudgetBackButton(language)}
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
    justifyContent: 'center',
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
  inputContainer: {
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