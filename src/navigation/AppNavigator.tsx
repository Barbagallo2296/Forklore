import React from 'react';
import { Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapPin, Heart } from 'lucide-react-native';

import RegioniScreen from '../screens/RegioniScreen';
import PiattiRegioneScreen from '../screens/PiattiRegioneScreen';
import DettaglioPiattoScreen from '../screens/DettaglioPiattoScreen';
import PreferitiScreen from '../screens/PreferitiScreen';

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

const headerOptions = {
  headerStyle: { backgroundColor: '#E07A5F' },
  headerTintColor: '#ffffff',
  headerTitleStyle: { fontWeight: '700' as const },
};

function RegioniStackNavigator() {
  return (
    <RegioniStack.Navigator screenOptions={headerOptions}>
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
  return (
    <PreferitiStack.Navigator screenOptions={headerOptions}>
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
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#E07A5F',
          tabBarInactiveTintColor: '#999999',
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={{ color: '#E07A5F33', borderless: false }}
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