import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight } from 'lucide-react-native';
import { REGIONI } from '../data/regioni';
import { getPreferiti } from '../data/preferiti';
import { useTheme } from '../theme/ThemeContext';
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
        <Text style={styles.emptyEmoji}>🤍</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Non hai ancora salvato nessun piatto tra i preferiti.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={piattiPreferiti}
        keyExtractor={(item) => item.nome}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            activeOpacity={0.6}
            onPress={() =>
              navigation.navigate('DettaglioPiatto', { piattoNome: item.nome })
            }
          >
            <View>
              <Text style={[styles.nomePiatto, { color: colors.textPrimary }]}>
                {item.nome}
              </Text>
              <Text style={[styles.regionePiatto, { color: colors.textSecondary }]}>
                {item.regione}
              </Text>
            </View>
            <ChevronRight color={colors.chevron} size={22} />
          </TouchableOpacity>
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
    padding: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  regionePiatto: {
    fontSize: 13,
    marginTop: 2,
  },
});