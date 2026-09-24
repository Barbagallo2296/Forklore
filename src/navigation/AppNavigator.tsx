import React from 'react';
import { Pressable, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapPin, Heart, Sun, Moon } from 'lucide-react-native';

import RegioniScreen from '../screens/RegioniScreen';
import PiattiRegioneScreen from '../screens/PiattiRegioneScreen';
import DettaglioPiattoScreen from '../screens/DettaglioPiattoScreen';
import PreferitiScreen from '../screens/PreferitiScreen';
import { useTheme } from '../theme/ThemeContext';

type DettaglioParams = { piattoNome: string };

export type RegioniStackParamList = {
  Regioni: undefined;
  PiattiRegione: { regioneId: string };
  DettaglioPiatto: DettaglioParams;
};

export type PreferitiStackParamList = {
  Preferiti: undefined;
  DettaglioPiatto: DettaglioParams;
};

const RegioniStack = createNativeStackNavigator<RegioniStackParamList>();
const PreferitiStack = createNativeStackNavigator<PreferitiStackParamList>();
const Tab = createBottomTabNavigator();

function ThemeToggleButton() {
  const { mode, toggleTheme } = useTheme();
  return (
    <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 12 }}>
      {mode === 'light' ? (
        <Moon color="#ffffff" size={22} />
      ) : (
        <Sun color="#ffffff" size={22} />
      )}
    </TouchableOpacity>
  );
}

function RegioniStackNavigator() {
  const { colors } = useTheme();
  return (
    <RegioniStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '700' },
        headerRight: () => <ThemeToggleButton />,
      }}
    >
      <RegioniStack.Screen
        name="Regioni"
        component={RegioniScreen}
        options={{ title: 'Forklore' }}
      />
      <RegioniStack.Screen
        name="PiattiRegione"
        component={PiattiRegioneScreen}
        options={{ title: 'Piatti tipici' }}
      />
      <RegioniStack.Screen
        name="DettaglioPiatto"
        component={DettaglioPiattoScreen}
        options={{ title: 'Dettaglio' }}
      />
    </RegioniStack.Navigator>
  );
}

function PreferitiStackNavigator() {
  const { colors } = useTheme();
  return (
    <PreferitiStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '700' },
        headerRight: () => <ThemeToggleButton />,
      }}
    >
      <PreferitiStack.Screen
        name="Preferiti"
        component={PreferitiScreen}
        options={{ title: 'Preferiti' }}
      />
      <PreferitiStack.Screen
        name="DettaglioPiatto"
        component={DettaglioPiattoScreen}
        options={{ title: 'Dettaglio' }}
      />
    </PreferitiStack.Navigator>
  );
}

export default function AppNavigator() {
  const { colors } = useTheme();
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#999999',
          tabBarStyle: { backgroundColor: colors.card },
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={{ color: colors.primaryLight, borderless: false }}
            />
          ),
        }}
      >
        <Tab.Screen
          name="RegioniTab"
          component={RegioniStackNavigator}
          options={{
            title: 'Regioni',
            headerShown: false,
            tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="PreferitiTab"
          component={PreferitiStackNavigator}
          options={{
            title: 'Preferiti',
            headerShown: false,
            tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}