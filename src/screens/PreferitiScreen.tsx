import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { REGIONI } from '../data/regioni';
import { getPreferiti } from '../data/preferiti';
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

  useFocusEffect(
    useCallback(() => {
      setPreferiti(getPreferiti());
    }, []),
  );

  const piattiPreferiti = TUTTI_I_PIATTI.filter((p) => preferiti.includes(p.nome));

  if (piattiPreferiti.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🤍</Text>
        <Text style={styles.emptyText}>
          Non hai ancora salvato nessun piatto tra i preferiti.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={piattiPreferiti}
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
            <View>
              <Text style={styles.nomePiatto}>{item.nome}</Text>
              <Text style={styles.regionePiatto}>{item.regione}</Text>
            </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
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
  regionePiatto: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  freccia: {
    fontSize: 26,
    color: '#c0c0c0',
    fontWeight: '300',
  },
});