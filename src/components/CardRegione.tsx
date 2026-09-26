import React, { memo } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import Card from './Card';
import SagomaRegione from './SagomaRegione';
import { useTheme } from '../theme/ThemeContext';
import { font } from '../theme/tipografia';
import type { Regione } from '../data/regioni';

type Props = {
  regione: Regione;
  // Percentuale di piatti scoperti (da 0 a 1)
  progresso: number;
  // Riceve l'id della regione: così chi usa la card può passare sempre la stessa funzione
  onPress: (regioneId: string) => void;
  // Versione più piccola, per il carosello
  compatta?: boolean;
  style?: StyleProp<ViewStyle>;
};

// memo: la home ne mostra 20 e non serve ridisegnarle se progresso e tema non cambiano
function CardRegione({ regione, progresso, onPress, compatta = false, style }: Props) {
  const { colors } = useTheme();
  const totale = regione.piatti.length;
  const scoperti = Math.round(progresso * totale);
  const conquistata = progresso === 1;
  const coloreProgresso = conquistata ? colors.secondary : colors.primary;

  return (
    <Card
      style={[styles.card, compatta && styles.cardCompatta, style]}
      onPress={() => onPress(regione.id)}
    >
      <View
        style={[
          styles.sagoma,
          compatta && styles.sagomaCompatta,
          { backgroundColor: colors.background },
        ]}
      >
        <SagomaRegione regioneId={regione.id} progresso={progresso} size={compatta ? 48 : 60} />
        {conquistata && (
          <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
            <Check size={12} color={colors.onPrimary} strokeWidth={3} />
          </View>
        )}
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
          {scoperti}/{totale}
        </Text>
      </View>
    </Card>
  );
}

export default memo(CardRegione);

const styles = StyleSheet.create({
  card: {
    padding: 10,
  },
  cardCompatta: {
    width: 132,
  },
  sagoma: {
    height: 76,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  sagomaCompatta: {
    height: 64,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
