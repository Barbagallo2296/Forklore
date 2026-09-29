import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { REGIONI, trovaRegioneDelPiatto } from '../data/regioni';
import { getPreferiti, getRegioniPreferiti } from '../data/preferiti';
import RigaPiatto from '../components/RigaPiatto';
import StatoVuoto from '../components/StatoVuoto';
import ComparsaAnimata from '../components/ComparsaAnimata';
import { useTheme } from '../theme/ThemeContext';
import { font } from '../theme/tipografia';
import type { PreferitiStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<PreferitiStackParamList, 'DettaglioPiatto'>;

type Preferito = { nome: string; regioneId?: string; regioneNome?: string };

function caricaPreferiti(): Preferito[] {
  const regioniSalvate = getRegioniPreferiti();
  return getPreferiti()
    .slice()
    .reverse()
    .map((nome) => {
      const regione =
        REGIONI.find((r) => r.id === regioniSalvate[nome]) ?? trovaRegioneDelPiatto(nome);
      return { nome, regioneId: regione?.id, regioneNome: regione?.nome };
    });
}

export default function PreferitiScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [preferiti, setPreferiti] = useState<Preferito[]>([]);
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      setPreferiti(caricaPreferiti());
    }, []),
  );

  if (preferiti.length === 0) {
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
        data={preferiti}
        keyExtractor={(item) => item.nome}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={[styles.conteggio, { color: colors.textSecondary }]}>
            {preferiti.length === 1 ? '1 piatto salvato' : `${preferiti.length} piatti salvati`}
          </Text>
        }
        renderItem={({ item, index }) => (
          <ComparsaAnimata indice={index}>
            <RigaPiatto
              nome={item.nome}
              regione={item.regioneNome}
              onPress={() =>
                navigation.navigate('DettaglioPiatto', {
                  piattoNome: item.nome,
                  regioneId: item.regioneId,
                })
              }
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
