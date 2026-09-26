import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { REGIONI, getProvince } from '../data/regioni';
import { getVisti } from '../data/visti';
import Card from '../components/Card';
import RigaPiatto from '../components/RigaPiatto';
import ComparsaAnimata from '../components/ComparsaAnimata';
import { useTheme } from '../theme/ThemeContext';
import { font, testo } from '../theme/tipografia';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'Provincia'>;
type RoutePropType = RouteProp<RegioniStackParamList, 'Provincia'>;

export default function ProvinciaScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { regioneId, provinciaId } = useRoute<RoutePropType>().params;
  const { colors } = useTheme();
  const [visti, setVisti] = useState<string[]>([]);

  const regione = REGIONI.find((r) => r.id === regioneId);
  const provincia = getProvince(regioneId).find((p) => p.id === provinciaId);

  useFocusEffect(
    useCallback(() => {
      setVisti(getVisti());
    }, []),
  );

  if (!provincia || !regione) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textPrimary }}>Provincia non trovata</Text>
      </View>
    );
  }

  const scoperti = provincia.piatti.filter((p) => visti.includes(p.nome)).length;
  const totale = provincia.piatti.length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={provincia.piatti}
        keyExtractor={(item) => item.nome}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Card style={styles.intestazione}>
              <View style={[styles.sigla, { backgroundColor: colors.primary }]}>
                <Text style={[styles.siglaTesto, { color: colors.onPrimary }]}>
                  {provincia.sigla}
                </Text>
              </View>
              <View style={styles.titoli}>
                <Text style={[testo.titolo, { color: colors.textPrimary }]}>{provincia.nome}</Text>
                <Text style={[styles.sottotitolo, { color: colors.textSecondary }]}>
                  {regione.nome} · {scoperti} di {totale} piatti scoperti
                </Text>
              </View>
            </Card>
            <Text style={[testo.titoloSezione, styles.sezione, { color: colors.textPrimary }]}>
              Specialità della provincia
            </Text>
          </>
        }
        renderItem={({ item, index }) => (
          <ComparsaAnimata indice={index}>
            <RigaPiatto
              nome={item.nome}
              visto={visti.includes(item.nome)}
              onPress={() =>
                navigation.navigate('DettaglioPiatto', { piattoNome: item.nome, regioneId })
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
  intestazione: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 20,
  },
  sigla: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  siglaTesto: {
    fontFamily: font.extrabold,
    fontSize: 20,
    letterSpacing: 1,
  },
  titoli: {
    flex: 1,
  },
  sottotitolo: {
    fontFamily: font.semibold,
    fontSize: 13,
    marginTop: 2,
  },
  sezione: {
    marginBottom: 12,
  },
});
