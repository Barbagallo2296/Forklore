import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { REGIONI } from '../data/regioni';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'PiattiRegione'>;
type RoutePropType = RouteProp<RegioniStackParamList, 'PiattiRegione'>;

export default function PiattiRegioneScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { regioneId } = route.params;

  const regione = REGIONI.find((r) => r.id === regioneId);

  if (!regione) {
    return (
      <View style={styles.container}>
        <Text>Regione non trovata</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={regione.piatti}
        keyExtractor={(item) => item.nome}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.6}
            onPress={() =>
              navigation.navigate('DettaglioPiatto', { piattoNome: item.nome })
            }
          >
            <Text style={styles.nomePiatto}>{item.nome}</Text>
            <Text style={styles.freccia}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  nomePiatto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  freccia: {
    fontSize: 26,
    color: '#c0c0c0',
    fontWeight: '300',
  },
});