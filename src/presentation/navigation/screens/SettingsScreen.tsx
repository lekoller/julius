import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch, useTheme, Menu } from 'react-native-paper';
import { ThemeContext, LanguageContext } from '../../../../App';
import {
  getSettingsDarkModeTitle,
  getSettingsDarkModeDescription,
  getSettingsLanguageTitle,
  getSettingsLanguageDescription,
  getSettingsLanguageEnglish,
  getSettingsLanguagePortuguese,
} from '../../texts/getters';

export const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = React.useContext(ThemeContext);
  const { language, setLanguage } = React.useContext(LanguageContext);
  const [languageMenuVisible, setLanguageMenuVisible] = React.useState(false);

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'en':
        return getSettingsLanguageEnglish(language);
      case 'pt':
        return getSettingsLanguagePortuguese(language);
      default:
        return getSettingsLanguageEnglish(language);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.settingItem, { borderBottomColor: theme.colors.outline }]}>
        <View style={styles.settingContent}>
          <View style={styles.settingInfo}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {getSettingsDarkModeTitle(language)}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {getSettingsDarkModeDescription(language)}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            color={theme.colors.primary}
          />
        </View>
      </View>

      <View style={[styles.settingItem, { borderBottomColor: theme.colors.outline }]}>
        <Menu
          visible={languageMenuVisible}
          onDismiss={() => setLanguageMenuVisible(false)}
          anchor={
            <View style={styles.settingContent}>
              <View style={styles.settingInfo}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                  {getSettingsLanguageTitle(language)}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {getSettingsLanguageDescription(language)}
                </Text>
              </View>
              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.primary }}
                onPress={() => setLanguageMenuVisible(true)}
              >
                {getLanguageLabel(language)}
              </Text>
            </View>
          }
        >
          <Menu.Item
            onPress={() => {
              setLanguage('en');
              setLanguageMenuVisible(false);
            }}
            title={getSettingsLanguageEnglish(language)}
            leadingIcon={language === 'en' ? 'check' : undefined}
          />
          <Menu.Item
            onPress={() => {
              setLanguage('pt');
              setLanguageMenuVisible(false);
            }}
            title={getSettingsLanguagePortuguese(language)}
            leadingIcon={language === 'pt' ? 'check' : undefined}
          />
        </Menu>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingItem: {
    borderBottomWidth: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
}); 