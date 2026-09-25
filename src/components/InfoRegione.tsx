import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react-native';
import { wikipediaQuery } from '../data/wikipedia';
import Skeleton from './Skeleton';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  nome: string;
};

const RIGHE_SKELETON = ['100%', '100%', '95%', '70%'] as const;

export default function InfoRegione({ nome }: Props) {
  const { colors } = useTheme();
  const [espanso, setEspanso] = useState(false);
  const { data, isLoading, isError } = useQuery(wikipediaQuery(nome));

  if (isError) {
    return null;
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.titoloRiga}>
        <MapPin size={16} color={colors.primary} />
        <Text style={[styles.titolo, { color: colors.textPrimary }]}>{nome}</Text>
      </View>

      {isLoading || !data ? (
        RIGHE_SKELETON.map((larghezza, i) => (
          <Skeleton key={i} width={larghezza} height={14} style={styles.rigaSkeleton} />
        ))
      ) : (
        <>
          <Text
            style={[styles.testo, { color: colors.textSecondary }]}
            numberOfLines={espanso ? undefined : 4}
          >
            {data.extract}
          </Text>
          <TouchableOpacity onPress={() => setEspanso((v) => !v)} hitSlop={8}>
            <Text style={[styles.altro, { color: colors.primary }]}>
              {espanso ? 'Mostra meno' : 'Mostra di più'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={[styles.sezione, { color: colors.textTertiary }]}>PIATTI TIPICI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  titoloRiga: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  titolo: {
    fontSize: 20,
    fontWeight: '700',
  },
  testo: {
    fontSize: 14,
    lineHeight: 21,
  },
  rigaSkeleton: {
    marginBottom: 8,
  },
  altro: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  sezione: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 16,
  },
});
