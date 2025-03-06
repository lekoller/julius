import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, Button, Card, TextInput, useTheme } from 'react-native-paper';
import { RootStackScreenProps } from '../types';
import { InitializeUserBudget } from '../../../application/useCases/InitializeUserBudget';
import { AsyncStorageUserRepository } from '../../../infrastructure/persistence/AsyncStorageUserRepository';
import { CycleFrequency } from '../types';
import { WEEK_DAYS } from '../../../domain/constants/time';
import { FREQUENCY_OPTIONS } from '../constants';
import { LanguageContext } from '../../../../App';
import {
  getSetBudgetTitle,
  getSetBudgetDescription,
  getSetBudgetDailyBudgetLabel,
  getSetBudgetRenewalHourLabel,
  getSetBudgetCycleSectionTitle,
  getSetBudgetCycleFrequencyLabel,
  getSetBudgetNoCycle,
  getSetBudgetDayOfWeekLabel,
  getSetBudgetSelectDayOfWeek,
  getSetBudgetErrorInvalidBudget,
  getSetBudgetErrorInvalidHour,
  getSetBudgetErrorInvalidDay,
  getSetBudgetErrorInvalidWeekDay,
  getSetBudgetErrorInvalidMonthDay,
  getSetBudgetErrorInvalidYearDay,
  getSetBudgetErrorInvalidMonth,
  getSetBudgetErrorSaveFailed,
  getSetBudgetContinueButton,
  getSetBudgetBackButton,
  getCommonEnterAmountPlaceholder,
  getCommonEnterHourPlaceholder,
  getCommonEnterDayPlaceholder,
  getBudgetConfirmationDayOfMonthLabel,
  getBudgetConfirmationMonthLabel,
} from '../../texts/getters';

export const SetBudgetScreen: React.FC<RootStackScreenProps<'SetBudget'>> = ({ navigation }) => {
  const [dailyBudget, setDailyBudget] = useState('');
  const [renewalHour, setRenewalHour] = useState('0');
  const [frequency, setFrequency] = useState<CycleFrequency | null>(null);
  const [renewalDay, setRenewalDay] = useState('');
  const [renewalMonth, setRenewalMonth] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const theme = useTheme();
  const { language } = React.useContext(LanguageContext);

  const handleContinue = async () => {
    const budget = parseFloat(dailyBudget);
    const hour = parseInt(renewalHour, 10);
    const day = frequency ? parseInt(renewalDay, 10) : 1;
    const month = frequency === 'yearly' ? (renewalMonth ? parseInt(renewalMonth, 10) : null) : null;

    if (isNaN(budget) || budget <= 0) {
      setError(getSetBudgetErrorInvalidBudget(language));
      return;
    }

    if (isNaN(hour) || hour < 0 || hour > 23) {
      setError(getSetBudgetErrorInvalidHour(language));
      return;
    }

    if (frequency) {
      if (isNaN(day)) {
        setError(getSetBudgetErrorInvalidDay(language));
        return;
      }

      switch (frequency) {
        case 'weekly':
          if (day < 1 || day > 7) {
            setError(getSetBudgetErrorInvalidWeekDay(language));
            return;
          }
          break;
        case 'monthly':
          if (day < 1 || day > 31) {
            setError(getSetBudgetErrorInvalidMonthDay(language));
            return;
          }
          break;
        case 'yearly':
          if (day < 1 || day > 31) {
            setError(getSetBudgetErrorInvalidYearDay(language));
            return;
          }
          if (month === null || month < 1 || month > 12) {
            setError(getSetBudgetErrorInvalidMonth(language));
            return;
          }
          break;
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      const userRepository = AsyncStorageUserRepository.getInstance();
      const initializeUserBudget = new InitializeUserBudget(userRepository);

      await initializeUserBudget.execute({
        dailyBudget: budget,
        renewalHour: hour,
        ...(frequency ? {
          frequency,
          renewalDay: day,
          ...(frequency === 'yearly' ? { renewalMonth: month } : {}),
        } : {}),
      });

      navigation.navigate('Main', { screen: 'Main' });
    } catch (err) {
      setError(getSetBudgetErrorSaveFailed(language));
      console.error('Error saving budget:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.scrollView, { backgroundColor: theme.colors.background }]} 
      contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.colors.background }]}
    >
      <Card style={styles.contentCard}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            {getSetBudgetTitle(language)}
          </Text>
          <Text variant="bodyLarge" style={styles.description}>
            {getSetBudgetDescription(language)}
          </Text>
          
          <View style={styles.form}>
            <TextInput
              label={getSetBudgetDailyBudgetLabel(language)}
              placeholder={getCommonEnterAmountPlaceholder(language)}
              keyboardType="numeric"
              value={dailyBudget}
              onChangeText={(text) => {
                setDailyBudget(text);
                setError(null);
              }}
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label={getSetBudgetRenewalHourLabel(language)}
              placeholder={getCommonEnterHourPlaceholder(language)}
              keyboardType="numeric"
              value={renewalHour}
              onChangeText={(text) => {
                setRenewalHour(text);
                setError(null);
              }}
              style={styles.input}
              mode="outlined"
            />

            <View style={styles.cycleSection}>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                {getSetBudgetCycleSectionTitle(language)}
              </Text>
              
              <TouchableOpacity
                onPress={() => setShowFrequencyPicker(true)}
                style={styles.inputContainer}
                activeOpacity={0.7}
              >
                <View pointerEvents="none">
                  <TextInput
                    label={getSetBudgetCycleFrequencyLabel(language)}
                    value={frequency ? FREQUENCY_OPTIONS.find(opt => opt.value === frequency)?.label || '' : getSetBudgetNoCycle(language)}
                    style={styles.input}
                    mode="outlined"
                    right={<TextInput.Icon icon="chevron-down" />}
                    editable={false}
                    showSoftInputOnFocus={false}
                  />
                </View>
              </TouchableOpacity>

              <Modal
                visible={showFrequencyPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowFrequencyPicker(false)}
              >
                <TouchableWithoutFeedback onPress={() => setShowFrequencyPicker(false)}>
                  <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                      <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                        <Text variant="titleLarge" style={styles.modalTitle}>
                          {getSetBudgetCycleFrequencyLabel(language)}
                        </Text>
                        <ScrollView style={styles.modalScroll}>
                          {FREQUENCY_OPTIONS.map((option) => (
                            <TouchableOpacity
                              key={option.value || 'none'}
                              style={styles.modalItem}
                              onPress={() => {
                                setFrequency(option.value);
                                setShowFrequencyPicker(false);
                                setError(null);
                              }}
                            >
                              <Text style={styles.modalItemText}>{option.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>

              {frequency && (
                <>
                  {frequency === 'weekly' ? (
                    <>
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
                    </>
                  ) : frequency === 'monthly' ? (
                    <TextInput
                      label={getBudgetConfirmationDayOfMonthLabel(language)}
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
                  ) : frequency === 'yearly' && (
                    <>
                      <TextInput
                        label={getBudgetConfirmationDayOfMonthLabel(language)}
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
                    </>
                  )}
                </>
              )}
            </View>

            {error && (
              <Text variant="bodyMedium" style={[styles.error, { color: theme.colors.error }]}>
                {error}
              </Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleContinue}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  },
  input: {
    width: '100%',
  },
  cycleSection: {
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  error: {
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
    marginTop: 32,
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