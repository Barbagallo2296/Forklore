import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { useTheme } from '../theme/ThemeContext';
import { font } from '../theme/tipografia';
import type { Provincia } from '../data/regioni';

type Props = {
  provincia: Provincia;
  scoperti: number;
  onPress: () => void;
};

export default function CardProvincia({ provincia, scoperti, onPress }: Props) {
  const { colors } = useTheme();
  const totale = provincia.piatti.length;
  const completata = scoperti === totale;

  return (
    <Card style={styles.card} onPress={onPress}>
      <View
        style={[
          styles.sigla,
          { backgroundColor: completata ? colors.secondary : colors.primaryLight },
        ]}
      >
        <Text
          style={[styles.siglaTesto, { color: completata ? colors.onPrimary : colors.primary }]}
        >
          {provincia.sigla}
        </Text>
      </View>
      <Text style={[styles.nome, { color: colors.textPrimary }]} numberOfLines={1}>
        {provincia.nome}
      </Text>
      <Text
        style={[styles.progresso, { color: completata ? colors.secondary : colors.textSecondary }]}
      >
        {scoperti}/{totale}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 108,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  sigla: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  siglaTesto: {
    fontFamily: font.extrabold,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  nome: {
    fontFamily: font.bold,
    fontSize: 13,
  },
  progresso: {
    fontFamily: font.semibold,
    fontSize: 12,
    marginTop: 2,
  },
});
