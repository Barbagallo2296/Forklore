import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import RegioniScreen from '../screens/RegioniScreen';
import PiattiRegioneScreen from '../screens/PiattiRegioneScreen';
import DettaglioPiattoScreen from '../screens/DettaglioPiattoScreen';
import PreferitiScreen from '../screens/PreferitiScreen';
import { Pressable } from 'react-native';

export type RegioniStackParamList = {
  Regioni: undefined;
  PiattiRegione: { regioneId: string };
  DettaglioPiatto: { piattoNome: string };
};

const Stack = createNativeStackNavigator<RegioniStackParamList>();
const Tab = createBottomTabNavigator();

function RegioniStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#ec0b29' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="Regioni"
        component={RegioniScreen}
        options={{ title: 'Forklore' }}
      />
      <Stack.Screen
        name="PiattiRegione"
        component={PiattiRegioneScreen}
        options={{ title: 'Piatti tipici' }}
      />
      <Stack.Screen
        name="DettaglioPiatto"
        component={DettaglioPiattoScreen}
        options={{ title: 'Dettaglio' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={{ color: '#2e1c1722', borderless: false }}
            />
          ),
        }}
      >
        <Tab.Screen
          name="RegioniTab"
          component={RegioniStackNavigator}
          options={{ title: 'Regioni', headerShown: false }}
        />
        <Tab.Screen
          name="Preferiti"
          component={PreferitiScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}