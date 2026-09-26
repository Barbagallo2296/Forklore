import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { REGIONI } from '../data/regioni';
import { wikipediaQuery } from '../data/wikipedia';
import { getVisti } from '../data/visti';
import InfoRegione from '../components/InfoRegione';
import RigaPiatto from '../components/RigaPiatto';
import ComparsaAnimata from '../components/ComparsaAnimata';
import { useTheme } from '../theme/ThemeContext';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'PiattiRegione'>;
type RoutePropType = RouteProp<RegioniStackParamList, 'PiattiRegione'>;

export default function PiattiRegioneScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { regioneId } = route.params;
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const [visti, setVisti] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      setVisti(getVisti());
    }, []),
  );

  const regione = REGIONI.find((r) => r.id === regioneId);

  useEffect(() => {
    regione?.piatti.forEach((piatto) => {
      queryClient.prefetchQuery(wikipediaQuery(piatto.nome));
    });
  }, [regione, queryClient]);

  if (!regione) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textPrimary }}>Regione non trovata</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={regione.piatti}
        keyExtractor={(item) => item.nome}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <InfoRegione
            regioneId={regione.id}
            nome={regione.nome}
            scoperti={regione.piatti.filter((p) => visti.includes(p.nome)).length}
            totale={regione.piatti.length}
          />
        }
        renderItem={({ item, index }) => (
          <ComparsaAnimata indice={index}>
            <RigaPiatto
              nome={item.nome}
              visto={visti.includes(item.nome)}
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
});
