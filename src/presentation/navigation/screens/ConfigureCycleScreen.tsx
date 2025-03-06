import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Text, Button, Card, TextInput, useTheme } from 'react-native-paper';
import { DrawerScreenProps } from '../types';
import { AsyncStorageUserRepository } from '../../../infrastructure/persistence/AsyncStorageUserRepository';
import { CycleVO } from '../../../domain/value-objects/CycleVO';
import { WEEK_DAYS } from '../../../domain/constants/time';
import { CycleFrequency } from '../types';
import { FREQUENCY_OPTIONS } from '../constants';
import { LanguageContext } from '../../../../App';
import {
  getConfigureCycleTitle,
  getConfigureCycleDescription,
  getConfigureCycleFrequencyLabel,
  getConfigureCycleDayOfWeekLabel,
  getConfigureCycleDayOfMonthLabel,
} from '../../texts/getters';

export const ConfigureCycleScreen: React.FC<DrawerScreenProps<'ConfigureCycle'>> = ({ navigation }) => {
  const [frequency, setFrequency] = useState<CycleFrequency>('monthly');
  const [renewalHour, setRenewalHour] = useState('0');
  const [renewalDay, setRenewalDay] = useState('1');
  const [renewalMonth, setRenewalMonth] = useState('1');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showHourPicker, setShowHourPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const theme = useTheme();
  const { language } = React.useContext(LanguageContext);

  useEffect(() => {
    loadCurrentCycle();
  }, []);

  const loadCurrentCycle = async () => {
    try {
      const userRepository = AsyncStorageUserRepository.getInstance();
      const user = await userRepository.get();
      if (!user) {
        setError('User not found');
        return;
      }

      const currentCycle = user.budget.cycle;
      if (currentCycle) {
        setFrequency(currentCycle.name);
        setRenewalHour(currentCycle.renewalHour.toString());
        setRenewalDay(currentCycle.renewalDay.toString());
        if (currentCycle.renewalMonth) {
          setRenewalMonth(currentCycle.renewalMonth.toString());
        }
      }
    } catch (err) {
      console.error('Error loading current cycle:', err);
      setError('Failed to load current cycle configuration');
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const hour = parseInt(renewalHour, 10);
      const day = parseInt(renewalDay, 10);
      const month = parseInt(renewalMonth, 10);

      if (isNaN(hour) || hour < 0 || hour > 23) {
        setError('Please enter a valid hour (0-23)');
        return;
      }

      if (frequency === 'weekly' && (isNaN(day) || day < 1 || day > 7)) {
        setError('Please select a valid day of the week');
        return;
      }

      if (frequency === 'monthly' && (isNaN(day) || day < 1 || day > 31)) {
        setError('Please enter a valid day of month (1-31)');
        return;
      }

      if (frequency === 'yearly') {
        if (isNaN(day) || day < 1 || day > 31) {
          setError('Please enter a valid day (1-31)');
          return;
        }
        if (isNaN(month) || month < 1 || month > 12) {
          setError('Please enter a valid month (1-12)');
          return;
        }
      }

      const userRepository = AsyncStorageUserRepository.getInstance();
      const user = await userRepository.get();
      if (!user) {
        setError('User not found');
        return;
      }

      const cycle = new CycleVO(
        frequency,
        hour,
        day,
        frequency === 'yearly' ? month : null
      );

      user.budget.setCycle(cycle);
      await userRepository.save(user);

      navigation.goBack();
    } catch (err) {
      console.error('Error saving cycle configuration:', err);
      setError('Failed to save cycle configuration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.contentCard}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            {getConfigureCycleTitle(language)}
          </Text>
          <Text variant="bodyLarge" style={styles.description}>
            {getConfigureCycleDescription(language)}
          </Text>

          <View style={styles.form}>
            <TouchableOpacity
              onPress={() => setShowFrequencyPicker(true)}
              style={styles.inputContainer}
              activeOpacity={0.7}
            >
              <View pointerEvents="none">
                <TextInput
                  label={getConfigureCycleFrequencyLabel(language)}
                  value={FREQUENCY_OPTIONS.find(opt => opt.value === frequency)?.label || ''}
                  style={styles.input}
                  mode="outlined"
                  right={<TextInput.Icon icon="chevron-down" />}
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
                        {getConfigureCycleFrequencyLabel(language)}
                      </Text>
                      <ScrollView style={styles.modalScroll}>
                        {FREQUENCY_OPTIONS.map(option => (
                          <TouchableOpacity
                            key={option.value}
                            style={styles.modalItem}
                            onPress={() => {
                              setFrequency(option.value);
                              setShowFrequencyPicker(false);
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

            <TouchableOpacity
              onPress={() => setShowHourPicker(true)}
              style={styles.inputContainer}
              activeOpacity={0.7}
            >
              <View pointerEvents="none">
                <TextInput
                  label="Renewal Hour (0-23)"
                  value={renewalHour}
                  style={styles.input}
                  mode="outlined"
                  right={<TextInput.Icon icon="chevron-down" />}
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
                        Renewal Hour
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
              <TouchableOpacity
                onPress={() => setShowDayPicker(true)}
                style={styles.inputContainer}
                activeOpacity={0.7}
              >
                <View pointerEvents="none">
                  <TextInput
                    label={frequency === 'weekly' ? getConfigureCycleDayOfWeekLabel(language) : getConfigureCycleDayOfMonthLabel(language)}
                    value={frequency === 'weekly' 
                      ? WEEK_DAYS.find(day => day.value.toString() === renewalDay)?.label || ''
                      : renewalDay
                    }
                    style={styles.input}
                    mode="outlined"
                    right={<TextInput.Icon icon="chevron-down" />}
                  />
                </View>
              </TouchableOpacity>
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
                        {frequency === 'weekly' ? getConfigureCycleDayOfWeekLabel(language) : getConfigureCycleDayOfMonthLabel(language)}
                      </Text>
                      <ScrollView style={styles.modalScroll}>
                        {frequency === 'weekly' 
                          ? WEEK_DAYS.map(day => (
                              <TouchableOpacity
                                key={day.value}
                                style={styles.modalItem}
                                onPress={() => {
                                  setRenewalDay(day.value.toString());
                                  setShowDayPicker(false);
                                }}
                              >
                                <Text style={styles.modalItemText}>{day.label}</Text>
                              </TouchableOpacity>
                            ))
                          : Array.from({ length: 31 }, (_, i) => (
                              <TouchableOpacity
                                key={i + 1}
                                style={styles.modalItem}
                                onPress={() => {
                                  setRenewalDay((i + 1).toString());
                                  setShowDayPicker(false);
                                }}
                              >
                                <Text style={styles.modalItemText}>{(i + 1).toString()}</Text>
                              </TouchableOpacity>
                            ))
                        }
                      </ScrollView>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            {frequency === 'yearly' && (
              <TouchableOpacity
                onPress={() => setShowMonthPicker(true)}
                style={styles.inputContainer}
                activeOpacity={0.7}
              >
                <View pointerEvents="none">
                  <TextInput
                    label="Month"
                    value={new Date(2000, parseInt(renewalMonth) - 1).toLocaleString('default', { month: 'long' })}
                    style={styles.input}
                    mode="outlined"
                    right={<TextInput.Icon icon="chevron-down" />}
                  />
                </View>
              </TouchableOpacity>
            )}

            <Modal
              visible={showMonthPicker}
              transparent
              animationType="slide"
              onRequestClose={() => setShowMonthPicker(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowMonthPicker(false)}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                      <Text variant="titleLarge" style={styles.modalTitle}>
                        Month
                      </Text>
                      <ScrollView style={styles.modalScroll}>
                        {Array.from({ length: 12 }, (_, i) => (
                          <TouchableOpacity
                            key={i + 1}
                            style={styles.modalItem}
                            onPress={() => {
                              setRenewalMonth((i + 1).toString());
                              setShowMonthPicker(false);
                            }}
                          >
                            <Text style={styles.modalItemText}>
                              {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                            </Text>
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