import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ChevronRight } from 'lucide-react-native';
import Card from './Card';
import { REGIONI_PATHS, MAPPA_VIEWBOX } from '../data/mappaItaliaPaths';
import { REGIONI, NUMERO_PIATTI_UNICI } from '../data/regioni';
import { contaConquistate } from '../data/visti';
import { useTheme } from '../theme/ThemeContext';
import { font, testo } from '../theme/tipografia';

type Props = {
  progresso: Record<string, number>;
  piattiScoperti: number;
  onPress: () => void;
};

function AnteprimaMappa({ progresso, piattiScoperti, onPress }: Props) {
  const { colors } = useTheme();
  const conquistate = contaConquistate(progresso);
  const daIniziare = piattiScoperti === 0;

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={[styles.mappa, { backgroundColor: colors.background }]} pointerEvents="none">
        <Svg viewBox={MAPPA_VIEWBOX} width="100%" height="100%">
          {REGIONI_PATHS.map((regione) => {
            const percentuale = progresso[regione.id] ?? 0;
            return (
              <Path
                key={regione.id}
                d={regione.d}
                fill={percentuale > 0 ? colors.primary : colors.placeholder}
                fillOpacity={percentuale > 0 ? 0.25 + percentuale * 0.75 : 1}
                stroke={colors.textTertiary}
                strokeWidth={1.2}
              />
            );
          })}
        </Svg>
      </View>

      <View style={styles.testi}>
        <Text style={[testo.titoloSezione, { color: colors.textPrimary }]}>La tua Italia</Text>
        {daIniziare ? (
          <Text style={[styles.invito, { color: colors.textSecondary }]}>
            Apri il tuo primo piatto: ogni regione si colora man mano che ne scopri la cucina.
          </Text>
        ) : (
          <>
            <Text style={[styles.numero, { color: colors.primary }]}>
              {conquistate}
              <Text style={[styles.numeroTotale, { color: colors.textTertiary }]}>
                /{REGIONI.length}
              </Text>
            </Text>
            <Text style={[styles.etichetta, { color: colors.textSecondary }]}>
              regioni conquistate
            </Text>
            <Text style={[styles.etichetta, { color: colors.textSecondary }]}>
              {piattiScoperti} di {NUMERO_PIATTI_UNICI} piatti scoperti
            </Text>
          </>
        )}
        <View style={styles.apri}>
          <Text style={[styles.apriTesto, { color: colors.primary }]}>Apri la mappa</Text>
          <ChevronRight size={16} color={colors.primary} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 24,
  },
  mappa: {
    width: 140,
    aspectRatio: 500 / 620,
    borderRadius: 12,
    padding: 6,
  },
  testi: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  numero: {
    fontFamily: font.extrabold,
    fontSize: 32,
    marginTop: 4,
  },
  numeroTotale: {
    fontFamily: font.bold,
    fontSize: 18,
  },
  invito: {
    fontFamily: font.regular,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  etichetta: {
    fontFamily: font.regular,
    fontSize: 13,
  },
  apri: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  apriTesto: {
    fontFamily: font.bold,
    fontSize: 14,
  },
});

export default memo(AnteprimaMappa);
