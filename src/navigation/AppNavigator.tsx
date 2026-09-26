import React from 'react';
import { Pressable, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  type Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  type BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import { MapPin, Heart, Sun, Moon, CircleUser } from 'lucide-react-native';

import PiattiRegioneScreen from '../screens/PiattiRegioneScreen';
import DettaglioPiattoScreen from '../screens/DettaglioPiattoScreen';
import PreferitiScreen from '../screens/PreferitiScreen';
import RegioniScreen from '../screens/RegioniScreen';
import MappaItaliaScreen from '../screens/MappaItaliaScreen';
import ProfiloScreen from '../screens/ProfiloScreen';
import ProvinciaScreen from '../screens/ProvinciaScreen';
import LoginScreen from '../screens/LoginScreen';
import { useTheme } from '../theme/ThemeContext';
import { font } from '../theme/tipografia';
import type { ColorPalette } from '../theme/colors';
import { useUtente } from '../utente/UtenteContext';

// regioneId serve per i piatti non tra i 10 tipici (province, altri piatti da Wikipedia)
type DettaglioParams = { piattoNome: string; regioneId?: string };

export type RegioniStackParamList = {
  Regioni: undefined;
  Mappa: undefined;
  PiattiRegione: { regioneId: string };
  Provincia: { regioneId: string; provinciaId: string };
  DettaglioPiatto: DettaglioParams;
};

export type PreferitiStackParamList = {
  Preferiti: undefined;
  DettaglioPiatto: DettaglioParams;
};

export type ProfiloStackParamList = {
  Profilo: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  App: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const RegioniStack = createNativeStackNavigator<RegioniStackParamList>();
const PreferitiStack = createNativeStackNavigator<PreferitiStackParamList>();
const ProfiloStack = createNativeStackNavigator<ProfiloStackParamList>();
const Tab = createBottomTabNavigator();

type IconaTabProps = { color: string; size: number };

const iconaRegioni = ({ color, size }: IconaTabProps) => <MapPin color={color} size={size} />;
const iconaPreferiti = ({ color, size }: IconaTabProps) => <Heart color={color} size={size} />;
const iconaProfilo = ({ color, size }: IconaTabProps) => (
  <CircleUser color={color} size={size} />
);

function ThemeToggleButton() {
  const { mode, colors, toggleTheme } = useTheme();
  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.bottoneTema} hitSlop={8}>
      {mode === 'light' ? (
        <Moon color={colors.textPrimary} size={22} />
      ) : (
        <Sun color={colors.textPrimary} size={22} />
      )}
    </TouchableOpacity>
  );
}

const headerTema = () => <ThemeToggleButton />;

function TabBarButton(props: BottomTabBarButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable {...props} android_ripple={{ color: colors.primaryLight, borderless: false }} />
  );
}

const tabBarButton = (props: BottomTabBarButtonProps) => <TabBarButton {...props} />;

// Stile comune degli header di tutti gli stack: stesso colore dello sfondo, titolo serif
function useOpzioniHeader() {
  const { colors } = useTheme();
  return {
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.textPrimary,
    headerTitleStyle: { fontFamily: font.titolo, fontSize: 20 },
    headerShadowVisible: false,
  };
}

// Tema di React Navigation allineato alla nostra palette (sfondi, tab bar, font)
function creaTemaNavigazione(mode: 'light' | 'dark', colors: ColorPalette): Theme {
  const base = mode === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.primary,
    },
    fonts: {
      regular: { fontFamily: font.regular, fontWeight: 'normal' },
      medium: { fontFamily: font.semibold, fontWeight: 'normal' },
      bold: { fontFamily: font.bold, fontWeight: 'normal' },
      heavy: { fontFamily: font.extrabold, fontWeight: 'normal' },
    },
  };
}

function RegioniStackNavigator() {
  const opzioniHeader = useOpzioniHeader();
  return (
    <RegioniStack.Navigator screenOptions={{ ...opzioniHeader, headerRight: headerTema }}>
      <RegioniStack.Screen
        name="Regioni"
        component={RegioniScreen}
        options={{ title: 'Forklore' }}
      />
      <RegioniStack.Screen
        name="Mappa"
        component={MappaItaliaScreen}
        options={{ title: 'La tua Italia' }}
      />
      <RegioniStack.Screen
        name="Provincia"
        component={ProvinciaScreen}
        options={{ title: 'Provincia' }}
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
  const opzioniHeader = useOpzioniHeader();
  return (
    <PreferitiStack.Navigator screenOptions={{ ...opzioniHeader, headerRight: headerTema }}>
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

function ProfiloStackNavigator() {
  const opzioniHeader = useOpzioniHeader();
  return (
    <ProfiloStack.Navigator screenOptions={opzioniHeader}>
      <ProfiloStack.Screen
        name="Profilo"
        component={ProfiloScreen}
        options={{ title: 'Profilo' }}
      />
    </ProfiloStack.Navigator>
  );
}

function MainTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: [styles.tabBar, { backgroundColor: colors.card }],
        tabBarLabelStyle: styles.tabBarEtichetta,
        tabBarButton,
      }}
    >
      <Tab.Screen
        name="RegioniTab"
        component={RegioniStackNavigator}
        options={{ title: 'Regioni', tabBarIcon: iconaRegioni }}
      />
      <Tab.Screen
        name="PreferitiTab"
        component={PreferitiStackNavigator}
        options={{ title: 'Preferiti', tabBarIcon: iconaPreferiti }}
      />
      <Tab.Screen
        name="ProfiloTab"
        component={ProfiloStackNavigator}
        options={{ title: 'Profilo', tabBarIcon: iconaProfilo }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { nome } = useUtente();
  const { mode, colors } = useTheme();
  return (
    <NavigationContainer theme={creaTemaNavigazione(mode, colors)}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {nome ? (
          <RootStack.Screen name="App" component={MainTabs} />
        ) : (
          <RootStack.Screen name="Login" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bottoneTema: {
    marginRight: 12,
  },
  tabBar: {
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: '#3B2414',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabBarEtichetta: {
    fontFamily: font.semibold,
    fontSize: 11,
  },
});
