import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme, MD3DarkTheme, configureFonts, useTheme } from 'react-native-paper';
import { ThemeProvider } from './src/presentation/theme/ThemeProvider';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';
import { BudgetBackgroundService } from './src/infrastructure/services/BudgetBackgroundService';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageUserRepository } from './src/infrastructure/persistence/AsyncStorageUserRepository';

const THEME_STORAGE_KEY = '@julius:theme_mode';
const LANGUAGE_STORAGE_KEY = '@julius:language';

// Development flag to clear all data at startup
const CLEAR_DATA_AT_STARTUP = true;

type Language = 'en' | 'pt';

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  // Add more font configurations as needed
};

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',
    secondary: '#4CAF50',
    error: '#B00020',
    background: '#f5f5f5',
    surface: '#ffffff',
    surfaceVariant: '#f5f5f5',
  },
  fonts: configureFonts({ config: fontConfig }),
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#90CAF9',
    secondary: '#81C784',
    error: '#EF5350',
    background: '#121212',
    surface: '#1e1e1e',
    surfaceVariant: '#2d2d2d',
  },
  fonts: configureFonts({ config: fontConfig }),
};

export const ThemeContext = React.createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const LanguageContext = React.createContext({
  language: 'en' as Language,
  setLanguage: (lang: Language) => {},
});

const AppContent = () => {
  const theme = useTheme();
  const { isDarkMode } = React.useContext(ThemeContext);
  const { language } = React.useContext(LanguageContext);

  useEffect(() => {
    const initializeBackgroundService = async () => {
      try {
        const budgetService = BudgetBackgroundService.getInstance();
        await budgetService.initialize();
      } catch (error) {
        console.error('Failed to initialize background service:', error);
      }
    };

    initializeBackgroundService();
  }, []);

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
        animated={true}
      />
      <SafeAreaView 
        style={[
          styles.container, 
          { 
            backgroundColor: theme.colors.surface,
          }
        ]}
      >
        <RootNavigator />
      </SafeAreaView>
    </>
  );
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Clear all data if development flag is true
      if (CLEAR_DATA_AT_STARTUP) {
        console.log('Clearing all data at startup...');
        const userRepository = AsyncStorageUserRepository.getInstance();
        await userRepository.clearAll();
        await AsyncStorage.removeItem(THEME_STORAGE_KEY);
        await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY);
        console.log('All data cleared successfully');
      }

      // Load preferences after potential data clearing
      await loadPreferences();
    } catch (error) {
      console.error('Error during app initialization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const [savedTheme, savedLanguage] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      ]);

      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
      if (savedLanguage !== null && (savedLanguage === 'en' || savedLanguage === 'pt')) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const handleLanguageChange = async (newLanguage: Language) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  if (isLoading) {
    return null; // Or a loading screen if you prefer
  }

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange }}>
          <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <ThemeProvider>
              <AppContent />
            </ThemeProvider>
          </PaperProvider>
        </LanguageContext.Provider>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
