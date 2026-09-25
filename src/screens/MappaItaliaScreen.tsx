import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { REGIONI_PATHS, MAPPA_VIEWBOX } from '../data/mappaItaliaPaths';
import { REGIONI } from '../data/regioni';
import { useTheme } from '../theme/ThemeContext';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'Regioni'>;

export default function MappaItaliaScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const [regioneAttiva, setRegioneAttiva] = useState<string | null>(null);

  const nomeRegioneAttiva = REGIONI.find((r) => r.id === regioneAttiva)?.nome;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.svgWrapper}>
        <Svg viewBox={MAPPA_VIEWBOX} width="100%" height="100%">
          {REGIONI_PATHS.map((regione) => (
            <Path
              key={regione.id}
              d={regione.d}
              fill={regioneAttiva === regione.id ? colors.primary : colors.card}
              stroke={colors.textSecondary}
              strokeWidth={1}
              onPressIn={() => setRegioneAttiva(regione.id)}
              onPressOut={() =>
                navigation.navigate('PiattiRegione', { regioneId: regione.id })
              }
            />
          ))}
        </Svg>
      </View>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        {nomeRegioneAttiva ?? 'Tocca una regione per scoprire i suoi piatti'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  svgWrapper: {
    width: '100%',
    aspectRatio: 500 / 620,
  },
  hint: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
});