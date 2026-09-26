import React from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Card from './Card';
import SagomaRegione from './SagomaRegione';
import { useTheme } from '../theme/ThemeContext';
import { font } from '../theme/tipografia';
import type { Regione } from '../data/regioni';

type Props = {
  regione: Regione;
  // Percentuale di piatti scoperti (da 0 a 1)
  progresso: number;
  onPress: () => void;
  // Versione più piccola, per il carosello "Continua a esplorare"
  compatta?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function CardRegione({ regione, progresso, onPress, compatta = false, style }: Props) {
  const { colors } = useTheme();
  const totale = regione.piatti.length;
  const scoperti = Math.round(progresso * totale);
  const conquistata = progresso === 1;
  const coloreProgresso = conquistata ? colors.secondary : colors.primary;

  return (
    <Card style={[styles.card, compatta && styles.cardCompatta, style]} onPress={onPress}>
      <View
        style={[
          styles.sagoma,
          compatta && styles.sagomaCompatta,
          { backgroundColor: colors.background },
        ]}
      >
        <SagomaRegione regioneId={regione.id} progresso={progresso} size={compatta ? 48 : 72} />
      </View>

      <Text
        style={[styles.nome, compatta && styles.nomeCompatto, { color: colors.textPrimary }]}
        numberOfLines={1}
      >
        {regione.nome}
      </Text>

      <View style={styles.progressoRiga}>
        <View style={[styles.barra, { backgroundColor: colors.placeholder }]}>
          <View
            style={[
              styles.barraPiena,
              { width: `${progresso * 100}%`, backgroundColor: coloreProgresso },
            ]}
          />
        </View>
        <Text
          style={[
            styles.progressoTesto,
            { color: conquistata ? colors.secondary : colors.textSecondary },
          ]}
        >
          {conquistata ? '✓' : `${scoperti}/${totale}`}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
  },
  cardCompatta: {
    width: 132,
    padding: 10,
  },
  sagoma: {
    height: 96,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  sagomaCompatta: {
    height: 64,
    marginBottom: 8,
  },
  nome: {
    fontFamily: font.titolo,
    fontSize: 16,
  },
  nomeCompatto: {
    fontSize: 14,
  },
  progressoRiga: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  barra: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barraPiena: {
    height: '100%',
    borderRadius: 3,
  },
  progressoTesto: {
    fontFamily: font.bold,
    fontSize: 12,
  },
});
