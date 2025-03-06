import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, useTheme } from 'react-native-paper';
import { RootStackScreenProps } from '../types';
import { LanguageContext } from '../../../../App';
import {
  getWelcomeTitle,
  getWelcomeDescription,
  getWelcomeSetBudgetButton,
  getWelcomeHelpButton,
} from '../../texts/getters';
import * as Location from 'expo-location';

export const WelcomeScreen: React.FC<RootStackScreenProps<'Welcome'>> = ({ navigation }) => {
  const theme = useTheme();
  const { language, setLanguage } = React.useContext(LanguageContext);

  useEffect(() => {
    const checkLocationAndSetLanguage = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          return; // User denied permission
        }

        const location = await Location.getCurrentPositionAsync({});
        
        const [address] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address?.isoCountryCode === 'BR' && language !== 'pt') {
          Alert.alert(
            'Detectamos que você está no Brasil',
            'Gostaria de mudar o idioma para português?',
            [
              {
                text: 'Não',
                style: 'cancel',
              },
              {
                text: 'Sim',
                onPress: () => setLanguage('pt'),
              },
            ]
          );
        }
      } catch (error) {
        console.error('Error checking location:', error);
      }
    };

    checkLocationAndSetLanguage();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.contentCard}>
        <Card.Content>
          <Text variant="displaySmall" style={styles.title}>
            {getWelcomeTitle(language)}
          </Text>
          <Text variant="bodyLarge" style={styles.description}>
            {getWelcomeDescription(language)}
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('SetBudget')}
              style={styles.button}
            >
              {getWelcomeSetBudgetButton(language)}
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('BudgetHelp')}
              style={styles.button}
            >
              {getWelcomeHelpButton(language)}
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
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
}); 