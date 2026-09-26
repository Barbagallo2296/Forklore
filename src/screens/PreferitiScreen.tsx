import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { REGIONI } from '../data/regioni';
import { getPreferiti } from '../data/preferiti';
import RigaPiatto from '../components/RigaPiatto';
import StatoVuoto from '../components/StatoVuoto';
import ComparsaAnimata from '../components/ComparsaAnimata';
import { useTheme } from '../theme/ThemeContext';
import { font } from '../theme/tipografia';
import type { PreferitiStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<PreferitiStackParamList, 'DettaglioPiatto'>;

const TUTTI_I_PIATTI = Array.from(
  new Map(
    REGIONI.flatMap((regione) =>
      regione.piatti.map((piatto) => [piatto.nome, { nome: piatto.nome, regione: regione.nome }]),
    ),
  ).values(),
);

export default function PreferitiScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [preferiti, setPreferiti] = useState<string[]>([]);
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      setPreferiti(getPreferiti());
    }, []),
  );

  const piattiPreferiti = TUTTI_I_PIATTI.filter((p) => preferiti.includes(p.nome));

  if (piattiPreferiti.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <StatoVuoto
          emoji="🤍"
          titolo="Nessun preferito"
          messaggio="Tocca il cuore nella pagina di un piatto per ritrovarlo qui."
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={piattiPreferiti}
        keyExtractor={(item) => item.nome}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={[styles.conteggio, { color: colors.textSecondary }]}>
            {piattiPreferiti.length === 1
              ? '1 piatto salvato'
              : `${piattiPreferiti.length} piatti salvati`}
          </Text>
        }
        renderItem={({ item, index }) => (
          <ComparsaAnimata indice={index}>
            <RigaPiatto
              nome={item.nome}
              regione={item.regione}
              onPress={() => navigation.navigate('DettaglioPiatto', { piattoNome: item.nome })}
            />
          </ComparsaAnimata>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  conteggio: {
    fontFamily: font.semibold,
    fontSize: 13,
    marginBottom: 10,
  },
});
