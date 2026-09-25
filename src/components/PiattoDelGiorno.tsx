import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react-native';
import { getPiattoDelGiorno } from '../data/regioni';
import { fetchWikipediaSummary, WIKIPEDIA_USER_AGENT } from '../data/wikipedia';
import { useTheme } from '../theme/ThemeContext';
import type { RegioniStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RegioniStackParamList, 'Regioni'>;

export default function PiattoDelGiorno() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const piatto = getPiattoDelGiorno();

  const { data } = useQuery({
    queryKey: ['wikipedia', piatto.nome],
    queryFn: () => fetchWikipediaSummary(piatto.nome),
  });

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('DettaglioPiatto', { piattoNome: piatto.nome })}
    >
      {data?.thumbnail ? (
        <Image
          source={{
            uri: data.thumbnail.source,
            headers: { 'User-Agent': WIKIPEDIA_USER_AGENT },
          }}
          style={styles.immagine}
        />
      ) : (
        <View style={[styles.immagine, styles.placeholder, { backgroundColor: colors.placeholder }]}>
          <Text style={styles.placeholderEmoji}>🍽️</Text>
        </View>
      )}

      <View style={styles.testi}>
        <View style={styles.etichettaRiga}>
          <Sparkles size={14} color={colors.primary} />
          <Text style={[styles.etichetta, { color: colors.primary }]}>PIATTO DEL GIORNO</Text>
        </View>
        <Text style={[styles.nome, { color: colors.textPrimary }]} numberOfLines={2}>
          {piatto.nome}
        </Text>
        <Text style={[styles.regione, { color: colors.textSecondary }]}>
          {piatto.regioneNome}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  immagine: {
    width: 84,
    height: 84,
    borderRadius: 12,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 32,
  },
  testi: {
    flex: 1,
    marginLeft: 14,
  },
  etichettaRiga: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  etichetta: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  regione: {
    fontSize: 13,
    marginTop: 2,
  },
});
