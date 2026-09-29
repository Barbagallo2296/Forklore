import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronRight } from 'lucide-react-native';
import { wikipediaQuery } from '../data/wikipedia';
import { nomeVisibile } from '../data/regioni';
import Card from './Card';
import ImmagineDissolvenza from './ImmagineDissolvenza';
import { useTheme } from '../theme/ThemeContext';
import { font, testo } from '../theme/tipografia';

type Props = {
  nome: string;
  regione?: string;
  visto?: boolean;
  onPress: () => void;
};

export default function RigaPiatto({ nome, regione, visto = false, onPress }: Props) {
  const { colors } = useTheme();
  const { data } = useQuery(wikipediaQuery(nome));

  return (
    <Card style={styles.card} onPress={onPress}>
      {data?.thumbnail ? (
        <ImmagineDissolvenza uri={data.thumbnail.source} style={styles.miniatura} />
      ) : (
        <View style={[styles.miniatura, styles.segnaposto, { backgroundColor: colors.placeholder }]}>
          <Text style={styles.segnapostoEmoji}>🍽️</Text>
        </View>
      )}

      <View style={styles.testi}>
        <Text style={[testo.voce, { color: colors.textPrimary }]} numberOfLines={2}>
          {nomeVisibile(nome)}
        </Text>
        {(regione || visto) && (
          <View style={styles.riga}>
            {visto && (
              <View style={[styles.visto, { backgroundColor: colors.secondaryLight }]}>
                <Check size={11} color={colors.secondary} strokeWidth={3} />
                <Text style={[styles.vistoTesto, { color: colors.secondary }]}>Scoperto</Text>
              </View>
            )}
            {regione && (
              <Text style={[testo.secondario, { color: colors.textSecondary }]}>{regione}</Text>
            )}
          </View>
        )}
      </View>

      <ChevronRight color={colors.chevron} size={20} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  miniatura: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  segnaposto: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  segnapostoEmoji: {
    fontSize: 24,
  },
  testi: {
    flex: 1,
    marginHorizontal: 12,
  },
  riga: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  visto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  vistoTesto: {
    fontFamily: font.bold,
    fontSize: 11,
  },
});
