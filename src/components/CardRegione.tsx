import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react-native';
import { ombra } from './Card';
import ImmagineDissolvenza from './ImmagineDissolvenza';
import SagomaRegione from './SagomaRegione';
import Sfumatura from './Sfumatura';
import { wikipediaQuery, immagineHero } from '../data/wikipedia';
import { useTheme } from '../theme/ThemeContext';
import { font } from '../theme/tipografia';
import type { Regione } from '../data/regioni';

type Props = {
  regione: Regione;
  progresso: number;
  onPress: (regioneId: string) => void;
  compatta?: boolean;
  style?: StyleProp<ViewStyle>;
};

function CardRegione({ regione, progresso, onPress, compatta = false, style }: Props) {
  const { colors } = useTheme();
  const { data } = useQuery(wikipediaQuery(regione.piatti[0].nome));
  const foto = data ? immagineHero(data, 500) : undefined;

  const totale = regione.piatti.length;
  const scoperti = Math.round(progresso * totale);
  const conquistata = progresso === 1;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        compatta ? styles.cardCompatta : styles.cardGriglia,
        { backgroundColor: colors.placeholder },
        style,
      ]}
      onPress={() => onPress(regione.id)}
      activeOpacity={0.85}
    >
      {foto ? (
        <>
          <ImmagineDissolvenza uri={foto} style={StyleSheet.absoluteFill} />
          <Sfumatura inizio={0.3} intensita={0.8} />
        </>
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.segnaposto]}>
          <SagomaRegione regioneId={regione.id} progresso={progresso} size={compatta ? 56 : 72} />
        </View>
      )}

      <View style={styles.inAlto}>
        {conquistata ? (
          <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
            <Check size={14} color={colors.onPrimary} strokeWidth={3} />
          </View>
        ) : (
          <View />
        )}
        {foto && (
          <View style={styles.sagomaAngolo}>
            <SagomaRegione regioneId={regione.id} progresso={progresso} size={compatta ? 24 : 30} />
          </View>
        )}
      </View>

      <View style={styles.testi}>
        <Text
          style={[styles.nome, compatta && styles.nomeCompatto, !foto && { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {regione.nome}
        </Text>
        <View style={styles.progressoRiga}>
          <View style={[styles.barra, !foto && { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.barraPiena,
                {
                  width: `${progresso * 100}%`,
                  backgroundColor: conquistata ? colors.secondary : colors.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressoTesto, !foto && { color: colors.textSecondary }]}>
            {scoperti}/{totale}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(CardRegione);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'space-between',
    ...ombra,
  },
  cardGriglia: {
    height: 172,
  },
  cardCompatta: {
    width: 140,
    height: 150,
  },
  segnaposto: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 36,
  },
  inAlto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sagomaAngolo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testi: {
    padding: 10,
  },
  nome: {
    fontFamily: font.titolo,
    fontSize: 17,
    color: '#FFFFFF',
  },
  nomeCompatto: {
    fontSize: 15,
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  barraPiena: {
    height: '100%',
    borderRadius: 3,
  },
  progressoTesto: {
    fontFamily: font.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
});
